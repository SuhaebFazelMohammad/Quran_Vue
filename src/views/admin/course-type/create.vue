<template>
  <div class="space-y-6">
    <Heading title="Create Course Type" link="/course-type" buttonText="Back" />

    <form
      @submit.prevent="handleSubmit"
      class="surface-card max-w-2xl space-y-5"
    >
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

      <Text
        id="level"
        v-model="form.level"
        label="Level"
        placeholder="Enter level (e.g. Beginner, Advanced)"
        icon-left="heroicons:adjustments-horizontal-20-solid"
        :error="errors.level"
        clearable
      />

      <Image
        id="image"
        v-model="form.image"
        label="Image"
        placeholder="Upload image"
        icon-left="heroicons:photo-20-solid"
        :error="errors.image"
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
          to="/course-type"
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

const form = ref({
  name: "",
  level: "",
  description: "",
  image: "",
});

const errors = ref<{
  name?: string;
  level?: string;
  description?: string;
  image?: string;
}>({});

function validateForm() {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = "Name is required";
  }

  if (form.value.level && !/^[a-zA-Z\s]+$/.test(form.value.level)) {
    errors.value.level = "Level should contain only letters";
  }

  if (form.value.description && form.value.description.length < 10) {
    errors.value.description = "Description should be at least 10 characters";
  }

  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  setTimeout(() => {
    console.log("Creating course type:", form.value);
    loading.value = false;
  }, 1000);
}
</script>
