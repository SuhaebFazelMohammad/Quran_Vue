<template>
  <div class="space-y-6">
    <Heading title="Course Details" link="/admin/course" buttonText="Back" />

    <div v-if="loading && !course" class="surface-card relative min-h-[400px]">
      <Loading />
    </div>

    <div v-else-if="notFound" class="surface-card p-8 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600"
      >
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-6 w-6" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-slate-800">
        Course not found
      </h2>
      <p class="mt-2 text-sm text-slate-500">
        The course you are looking for does not exist or was removed.
      </p>
      <RouterLink
        to="/admin/course"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 active:translate-y-px"
      >
        <Icon icon="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
        Back to Courses
      </RouterLink>
    </div>

    <div v-else-if="course" class="grid gap-6 lg:grid-cols-2">
      <!-- Main Information -->
      <div class="surface-card space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Course Information
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Basic course details
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Course Type
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ course.name }}
            </p>
          </div>

          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Phone Number
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ course.phone_num }}
            </p>
          </div>

          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Address
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ course.address }}
            </p>
          </div>

          <div v-if="course.description">
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Description
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ course.description }}
            </p>
          </div>

          <div v-if="course.date">
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Date
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ formatDate(course.date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="surface-card space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
            User Information
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Course user details
          </p>
        </div>

        <div v-if="course.user_id?.user" class="space-y-4">
          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              User Name
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ getUserName(course.user_id.user) }}
            </p>
          </div>

          <div v-if="course.user_id.user.email">
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Email
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ course.user_id.user.email }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 pt-4">
          <RouterLink
            :to="`/admin/course/${course.id}/edit`"
            class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
          >
            Edit Course
          </RouterLink>
          <RouterLink
            to="/admin/course"
            class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
          >
            Back to Courses
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import Heading from "../../../components/heading.vue";
import Loading from "../../../components/loading.vue";
import { getCourse, type Course } from "../../../api/courses";

const route = useRoute();
const loading = ref(false);
const notFound = ref(false);
const course = ref<Course | null>(null);

function formatDate(dateString: string | undefined): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getUserName(user: any): string {
  if (user.first_name || user.last_name) {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
  }
  return user.email || `User #${user.id}`;
}

async function loadCourse() {
  const id = Number(route.params.id);
  if (!id) {
    notFound.value = true;
    return;
  }

  loading.value = true;
  try {
    course.value = await getCourse(id);
  } catch (error: any) {
    console.error("Failed to load course", error);
    if (error?.response?.status === 404) {
      notFound.value = true;
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCourse();
});
</script>
