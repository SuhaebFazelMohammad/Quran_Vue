<template>
  <div class="space-y-6">
    <Heading
      title="Create Course Type"
      link="/admin/course-type"
      buttonText="Back"
    />

    <form
      @submit.prevent="handleSubmit"
      class="surface-card w-full space-y-6"
      novalidate
    >
      <SuccessMessage
        v-if="successMessage"
        :title="successMessage"
        message="The course type has been created successfully."
      />

      <ErrorMessage
        v-if="errorMessage"
        :title="errorMessage"
        message="Please check the form and try again."
      />
      <Text
        id="name"
        v-model="form.name"
        label="Type Name"
        placeholder="Enter type name"
        icon-left="heroicons:bookmark-20-solid"
        :error="errors.name"
        clearable
        required
      />

      <Image
        id="icon"
        v-model="form.icon"
        label="Icon"
        placeholder="Upload icon image"
        icon-left="heroicons:photo-20-solid"
        :error="errors.icon"
        clearable
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create Type</span>
        </button>
        <RouterLink
          to="/admin/course-type"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import Text from "../../../components/input/text.vue";
import Heading from "../../../components/heading.vue";
import Image from "../../../components/input/image.vue";

const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const form = ref({
  name: "",
  icon: null as File | null,
});

const errors = ref<{
  name?: string;
  icon?: string;
}>({});

import { createTypeCourse } from "../../../api/type-courses";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";

function validateForm() {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = "Name is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.value = {};

  try {
    await createTypeCourse({
      name: form.value.name,
      icon: form.value.icon || undefined,
    });

    successMessage.value = "Course type created successfully";

    form.value = {
      name: "",
      icon: null,
    };
  } catch (error: any) {
    console.error("Failed to create course type", error);

    if (error?.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const mappedErrors: any = {};

      Object.keys(backendErrors).forEach((key) => {
        if (key in form.value) {
          mappedErrors[key] = Array.isArray(backendErrors[key])
            ? backendErrors[key][0]
            : backendErrors[key];
        }
      });

      errors.value = mappedErrors;
    }

    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create course type. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>
