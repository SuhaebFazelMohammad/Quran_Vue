<template>
  <div class="space-y-6">
    <Heading title="Edit Course" link="/course" buttonText="Back" />

    <form @submit.prevent="handleSubmit" class="surface-card max-w-2xl space-y-5">
      <Text
        id="title"
        v-model="form.title"
        label="Course Title"
        placeholder="Enter course title"
        icon-left="heroicons:bookmark-20-solid"
        :error="errors.title"
        clearable
        required
      />

      <Text
        id="instructor"
        v-model="form.instructor"
        label="Instructor"
        placeholder="Enter instructor name"
        icon-left="heroicons:user-20-solid"
        :error="errors.instructor"
        clearable
        required
      />

      <Text
        id="category"
        v-model="form.category"
        label="Category"
        placeholder="Enter course category"
        icon-left="heroicons:tag-20-solid"
        :error="errors.category"
        clearable
      />

      <Text
        id="description"
        v-model="form.description"
        label="Short Description"
        placeholder="Add a brief course description"
        icon-left="heroicons:pencil-20-solid"
        :error="errors.description"
        clearable
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="loading">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
        <RouterLink
          to="/course"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Text from "../../../components/input/text.vue";
import Heading from "../../../components/heading.vue";

const loading = ref(false);

const form = ref({
  title: "",
  instructor: "",
  category: "",
  description: "",
});

const errors = ref<{
  title?: string;
  instructor?: string;
  category?: string;
  description?: string;
}>({});

const route = useRoute();

onMounted(() => {
  const { id } = route.params;

  // Replace with API data fetching when backend is ready
  form.value = {
    title: `Sample Course ${id}`,
    instructor: "Ustadh Sample",
    category: "Tajweed",
    description: "A sample course description to demonstrate editing.",
  };
});

function validateForm() {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = "Title is required";
  }

  if (!form.value.instructor.trim()) {
    errors.value.instructor = "Instructor is required";
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
    console.log("Updating course:", form.value);
    loading.value = false;
  }, 1000);
}
</script>


