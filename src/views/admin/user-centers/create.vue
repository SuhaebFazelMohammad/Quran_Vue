<template>
  <div class="space-y-6">
    <Heading title="Create User Center" link="/admin/user-centers" buttonText="Back" />

    <form class="surface-card space-y-5" @submit.prevent="handleSubmit">
      <SuccessMessage v-if="successMessage" :title="successMessage" />
      <ErrorMessage v-if="errorMessage" :title="errorMessage" />

      <Select
        id="quran_center_id"
        v-model="form.quran_center_id"
        :options="centerOptions"
        label="Quran Center"
        :error="errors.quran_center_id"
        :clearable="false"
        :searchable="true"
      />

      <Text
        id="user_id"
        v-model="form.user_id"
        label="User ID"
        placeholder="Enter user id"
        :error="errors.user_id"
        required
      />

      <button type="submit" class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20">
        Create Mapping
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
import { createUserCenter, getQuranCenters } from "../../../data/centers-local";

const form = ref({
  quran_center_id: 1 as number | undefined,
  user_id: "",
});

const errors = ref<Record<string, string>>({});
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const centerOptions = computed(() =>
  getQuranCenters().map((x) => ({ value: x.id, label: `${x.name} (#${x.id})` }))
);

function handleSubmit() {
  errors.value = {};
  successMessage.value = null;
  errorMessage.value = null;

  if (!form.value.quran_center_id) errors.value.quran_center_id = "Center is required";
  if (!form.value.user_id.trim()) errors.value.user_id = "User id is required";
  if (Object.keys(errors.value).length) return;

  try {
    createUserCenter({
      quran_center_id: Number(form.value.quran_center_id),
      user_id: Number(form.value.user_id),
    });
    form.value = {
      quran_center_id: centerOptions.value[0]?.value as number | undefined,
      user_id: "",
    };
    successMessage.value = "User-center mapping created successfully";
  } catch (error: any) {
    errorMessage.value = error?.message || "Failed to create mapping";
  }
}
</script>
