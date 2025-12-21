<template>
  <div class="space-y-6">
    <Heading
      title="Edit Course Type"
      link="/admin/course-type"
      buttonText="Back"
    />

    <SuccessMessage
      v-if="successMessage"
      :title="successMessage"
      message="The course type has been updated successfully."
    />

    <ErrorMessage
      v-if="errorMessage"
      :title="errorMessage"
      message="Please check the form and try again."
    />

    <div
      v-if="loading && !typeCourse"
      class="surface-card relative min-h-[400px]"
    >
      <Loading />
    </div>

    <div v-else-if="notFound" class="surface-card p-8 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600"
      >
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-6 w-6" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-slate-800">
        Course Type not found
      </h2>
      <p class="mt-2 text-sm text-slate-500">
        The course type you are looking for does not exist or was removed.
      </p>
      <RouterLink
        to="/admin/course-type"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 active:translate-y-px"
      >
        <Icon icon="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
        Back to Course Types
      </RouterLink>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-2">
      <!-- Read-only section -->
      <div class="surface-card space-y-6">
        <div>
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Current Information
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            View the current course type details.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Name
            </label>
            <p
              class="mt-1 text-sm font-medium text-slate-700 dark:text-slate-100"
            >
              {{ typeCourse?.name || "Not set" }}
            </p>
          </div>

          <div>
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Icon
            </label>
            <div class="mt-2">
              <img
                v-if="typeCourse?.icon"
                :src="typeCourse.icon"
                :alt="typeCourse.name"
                class="h-20 w-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              />
              <p v-else class="text-sm text-slate-400 dark:text-slate-500">
                No icon uploaded
              </p>
            </div>
          </div>

          <div v-if="typeCourse?.created_at">
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Created At
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ formatDate(typeCourse.created_at) }}
            </p>
          </div>

          <div v-if="typeCourse?.updated_at">
            <label
              class="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Updated At
            </label>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {{ formatDate(typeCourse.updated_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Editable section -->
      <form
        @submit.prevent="handleSubmit"
        class="surface-card space-y-6 relative"
        novalidate
      >
        <Loading v-if="submitting" />

        <div>
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Edit Information
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Update the course type details below.
          </p>
        </div>

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
          :current-image="typeCourse?.icon"
          clearable
        />

        

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            :disabled="submitting || !isDirty"
            class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              v-if="submitting"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
            ></span>
            <span v-else>Save Changes</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import Heading from "../../../components/heading.vue";
import Loading from "../../../components/loading.vue";
import Text from "../../../components/input/text.vue";
import Image from "../../../components/input/image.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import {
  getTypeCourse,
  updateTypeCourse,
  type TypeCourse,
  type UpdateTypeCourseData,
} from "../../../api/type-courses";

const route = useRoute();

const loading = ref(true);
const submitting = ref(false);
const notFound = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const typeCourse = ref<TypeCourse | null>(null);

interface TypeCourseForm {
  name: string;
  icon: File | null;
}

type FormErrors = Partial<Record<"name" | "icon", string>>;

const form = ref<TypeCourseForm>({
  name: "",
  icon: null,
});

const originalForm = ref<TypeCourseForm | null>(null);
const errors = ref<FormErrors>({});

const isDirty = computed(() => {
  if (!originalForm.value) return false;
  return (
    form.value.name !== originalForm.value.name ||
    form.value.icon !== originalForm.value.icon
  );
});

watch(
  () => route.params.id,
  () => {
    loadTypeCourse();
  },
  { immediate: true }
);

async function loadTypeCourse() {
  const idParam = Number(route.params.id);
  if (Number.isNaN(idParam)) {
    notFound.value = true;
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    notFound.value = false;
    const data = await getTypeCourse(idParam);

    // Debug: log the loaded data
    console.log("Loaded type course data:", data);
    console.log("Data name:", data.name);

    if (!data || !data.name) {
      throw new Error("Invalid data received from server");
    }

    typeCourse.value = data;
    form.value = {
      name: data.name || "",
      icon: null,
    };
    originalForm.value = {
      name: data.name || "",
      icon: null,
    };
    errors.value = {};
    successMessage.value = null;
    errorMessage.value = null;
  } catch (error: any) {
    console.error("Failed to load type course", error);
    console.error("Error details:", error?.response?.data);
    notFound.value = true;
    errorMessage.value =
      error?.response?.data?.message || "Failed to load course type data";
  } finally {
    loading.value = false;
  }
}

function validateForm(): boolean {
  const nextErrors: FormErrors = {};

  if (!form.value.name.trim()) {
    nextErrors.name = "Name is required.";
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  if (!typeCourse.value) {
    errorMessage.value = "Course type data is missing";
    return;
  }

  submitting.value = true;
  successMessage.value = null;
  errorMessage.value = null;
  errors.value = {};

  try {
    // Debug: log form values before submission
    console.log("Form values before submit:", form.value);
    console.log("Form name value:", form.value.name);
    console.log("Form name trimmed:", form.value.name?.trim());

    const trimmedName = form.value.name?.trim() || "";

    if (!trimmedName) {
      errors.value.name = "Name is required.";
      submitting.value = false;
      return;
    }

    const updateData: UpdateTypeCourseData = {
      name: trimmedName,
    };

    // Only include icon if it's a File (user selected a new icon)
    if (form.value.icon instanceof File) {
      updateData.icon = form.value.icon;
    }

    console.log("Sending update data:", updateData);
    await updateTypeCourse(typeCourse.value.id, updateData);

    successMessage.value = "Course type updated successfully";
    if (originalForm.value) {
      originalForm.value = { ...form.value };
    }

    await loadTypeCourse();
  } catch (error: any) {
    console.error("Failed to update course type", error);

    if (error?.response?.data?.errors) {
      const backendErrors = error.response.data.errors;
      const mappedErrors: FormErrors = {};

      Object.keys(backendErrors).forEach((key) => {
        if (key in form.value) {
          mappedErrors[key as keyof FormErrors] = Array.isArray(
            backendErrors[key]
          )
            ? backendErrors[key][0]
            : backendErrors[key];
        }
      });

      errors.value = mappedErrors;
    }

    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update course type. Please try again.";
  } finally {
    submitting.value = false;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
</script>
