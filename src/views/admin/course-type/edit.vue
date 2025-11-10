<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Edit Course Type
      </h1>
      <RouterLink
        to="/course-type"
        class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-semibold shadow-amber-500/20"
      >
        Back to Types
      </RouterLink>
    </div>

    <form @submit.prevent="handleSubmit" class="surface-card max-w-2xl space-y-5">
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

      <Text
        id="description"
        v-model="form.description"
        label="Description"
        placeholder="Add a brief description"
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
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Text from "../../../components/input/text.vue";

const loading = ref(false);

const form = ref({
  name: "",
  level: "",
  description: "",
});

const errors = ref<{
  name?: string;
  level?: string;
  description?: string;
}>({});

const route = useRoute();

onMounted(() => {
  const { id } = route.params;

  form.value = {
    name: `Sample Type ${id}`,
    level: "Intermediate",
    description: "Placeholder data for editing. Replace with API response.",
  };
});

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
    console.log("Updating course type:", form.value);
    loading.value = false;
  }, 1000);
}
</script>


