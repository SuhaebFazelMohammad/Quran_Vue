<template>
  <div class="space-y-6">
    <Heading title="Edit Center Type" link="/admin/center-types" buttonText="Back" />

    <div v-if="notFound" class="surface-card text-center">
      <p class="text-slate-600 dark:text-slate-300">Center type not found.</p>
    </div>

    <form v-else class="surface-card space-y-6" @submit.prevent="handleSubmit">
      <SuccessMessage v-if="successMessage" :title="successMessage" />
      <ErrorMessage v-if="errorMessage" :title="errorMessage" />

      <Text
        id="name"
        v-model="name"
        label="Center Type Name"
        placeholder="Enter center type name"
        icon-left="heroicons:tag-20-solid"
        :error="nameError"
        clearable
        required
      />

      <button
        type="submit"
        class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
      >
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Heading from "../../../components/heading.vue";
import Text from "../../../components/input/text.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { getCenterType, updateCenterType } from "../../../data/centers-local";

const route = useRoute();
const name = ref("");
const nameError = ref("");
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const notFound = ref(false);

function loadData() {
  const id = Number(route.params.id);
  const row = getCenterType(id);
  if (!row) {
    notFound.value = true;
    return;
  }
  name.value = row.name;
}

function handleSubmit() {
  nameError.value = "";
  successMessage.value = null;
  errorMessage.value = null;

  if (!name.value.trim()) {
    nameError.value = "Name is required";
    return;
  }

  const id = Number(route.params.id);
  const updated = updateCenterType(id, { name: name.value });
  if (!updated) {
    errorMessage.value = "Center type not found";
    return;
  }
  successMessage.value = "Center type updated successfully";
}

onMounted(loadData);
</script>
