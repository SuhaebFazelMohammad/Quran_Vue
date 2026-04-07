<template>
  <div class="space-y-6">
    <Heading title="Create Quran Center" link="/admin/quran-centers" buttonText="Back" />

    <form class="surface-card space-y-5" @submit.prevent="handleSubmit">
      <SuccessMessage v-if="successMessage" :title="successMessage" />
      <ErrorMessage v-if="errorMessage" :title="errorMessage" />

      <Text v-model="form.name" id="name" label="Name" placeholder="Center name" :error="errors.name" required />
      <Text v-model="form.city" id="city" label="City" placeholder="City" :error="errors.city" required />
      <Text v-model="form.location" id="location" label="Location" placeholder="Location" :error="errors.location" required />
      <Text v-model="form.created_by" id="created_by" label="Created By (User ID)" placeholder="e.g. 2" :error="errors.created_by" required />
      <Text v-model="form.approval_by" id="approval_by" label="Approval By (User ID, optional)" placeholder="e.g. 1" />

      <Select
        id="center_type_id"
        v-model="form.center_type_id"
        :options="centerTypeOptions"
        label="Center Type"
        :error="errors.center_type_id"
        :clearable="false"
        :searchable="false"
      />

      <div class="flex items-center gap-6">
        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.approval" type="checkbox" class="h-4 w-4 accent-amber-500" />
          <span>Approved</span>
        </label>
        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.softdelete" type="checkbox" class="h-4 w-4 accent-amber-500" />
          <span>Soft Delete</span>
        </label>
      </div>

      <button type="submit" class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20">
        Create Quran Center
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Heading from "../../../components/heading.vue";
import Text from "../../../components/input/text.vue";
import Select from "../../../components/input/select.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { createQuranCenter, getCenterTypes } from "../../../data/centers-local";

const form = ref({
  name: "",
  city: "",
  location: "",
  center_type_id: 1 as number | undefined,
  created_by: "",
  approval_by: "",
  approval: false,
  softdelete: false,
});

const errors = ref<Record<string, string>>({});
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const centerTypeOptions = computed(() =>
  getCenterTypes().map((x) => ({ value: x.id, label: x.name }))
);

function handleSubmit() {
  errors.value = {};
  successMessage.value = null;
  errorMessage.value = null;

  if (!form.value.name.trim()) errors.value.name = "Name is required";
  if (!form.value.city.trim()) errors.value.city = "City is required";
  if (!form.value.location.trim()) errors.value.location = "Location is required";
  if (!form.value.center_type_id) errors.value.center_type_id = "Center type is required";
  if (!form.value.created_by.trim()) errors.value.created_by = "Created by is required";
  if (Object.keys(errors.value).length) return;

  try {
    createQuranCenter({
      center_type_id: Number(form.value.center_type_id),
      city: form.value.city.trim(),
      name: form.value.name.trim(),
      created_by: Number(form.value.created_by),
      location: form.value.location.trim(),
      approval: form.value.approval,
      approval_by: form.value.approval_by ? Number(form.value.approval_by) : null,
      softdelete: form.value.softdelete,
    });

    form.value = {
      name: "",
      city: "",
      location: "",
      center_type_id: centerTypeOptions.value[0]?.value as number | undefined,
      created_by: "",
      approval_by: "",
      approval: false,
      softdelete: false,
    };
    successMessage.value = "Quran center created successfully";
  } catch (error: any) {
    errorMessage.value = error?.message || "Failed to create quran center";
  }
}
</script>
