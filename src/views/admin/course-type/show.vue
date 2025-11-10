<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Course Type Details
      </h1>
      <RouterLink
        to="/course-type"
        class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-semibold shadow-amber-500/20"
      >
        Back to Types
      </RouterLink>
    </div>

    <div class="surface-card max-w-3xl space-y-6">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {{ type.name }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Level: {{ type.level }}
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Description
        </h3>
        <p class="leading-relaxed text-slate-600 dark:text-slate-300">
          {{ type.description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <RouterLink
          :to="`/course-type/${type.id}/edit`"
          class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-semibold shadow-amber-500/20"
        >
          Edit Type
        </RouterLink>
        <RouterLink
          to="/course-type"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Back to Course Types
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const type = computed(() => {
  const { id } = route.params;

  return {
    id,
    name: `Course Type ${id}`,
    level: "Intermediate",
    description:
      "Placeholder course type description. Replace this content with API data when available.",
  };
});
</script>


