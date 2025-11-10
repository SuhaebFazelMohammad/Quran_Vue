<template>
  <div class="space-y-6">
    <Heading title="Course Details" link="/course" buttonText="Back" />

    <div class="surface-card max-w-3xl space-y-6">
      <div class="space-y-2">
        <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {{ course.title }}
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Instructor: {{ course.instructor }}
        </p>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Category: {{ course.category }}
        </p>
      </div>

      <div class="space-y-2">
        <h3 class="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Description
        </h3>
        <p class="leading-relaxed text-slate-600 dark:text-slate-300">
          {{ course.description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-3">
        <RouterLink
          :to="`/course/${course.id}/edit`"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
        >
          Edit Course
        </RouterLink>
        <RouterLink
          to="/course"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Back to Courses
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Heading from "../../../components/heading.vue";

const route = useRoute();

const course = computed(() => {
  const { id } = route.params;

  // Replace with real data fetching
  return {
    id,
    title: `Sample Course ${id}`,
    instructor: "Ustadh Sample",
    category: "Tajweed",
    description:
      "This is a placeholder course description. Replace this content once the API is connected.",
  };
});
</script>


