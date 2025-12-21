<template>
  <div class="space-y-6">
    <Heading title="Create Course" link="/admin/course" buttonText="Back" />

    <form
      @submit.prevent="handleSubmit"
      class="surface-card w-full space-y-6"
      novalidate
    >
      <SuccessMessage
        v-if="successMessage"
        :title="successMessage"
        message="The course has been created successfully."
      />

      <ErrorMessage
        v-if="errorMessage"
        :title="errorMessage"
        message="Please check the form and try again."
      />

      <Select
        id="type_id"
        v-model="form.type_id"
        :options="courseTypeOptions"
        label="Course Type"
        placeholder="Select course type"
        icon-left="heroicons:tag-20-solid"
        :error="errors.type_id"
        :clearable="false"
        :searchable="true"
        required
      />

      <SearchSelect
        id="user_id"
        v-model="form.user_id"
        :options="userOptions"
        label="User"
        placeholder="Search user by name or email"
        icon-left="heroicons:user-20-solid"
        :error="errors.user_id"
        :clearable="true"
        :required="true"
      />

      <div class="space-y-3">
        <label
          class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Phone Numbers <span class="text-red-500">*</span>
        </label>

        <div
          v-for="(_, index) in phoneNumbers"
          :key="index"
          class="flex items-start gap-2"
        >
          <Text
            :id="`phone_${index}`"
            v-model="phoneNumbers[index]"
            :placeholder="`Enter phone number ${index + 1}`"
            type="tel"
            icon-left="heroicons:phone-20-solid"
            :error="
              index === 0 && errors.phone_num ? errors.phone_num : undefined
            "
            class="flex-1"
          />
          <button
            v-if="phoneNumbers.length > 1"
            type="button"
            @click="removePhone(index)"
            class="mt-0.5 rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
            aria-label="Remove phone number"
          >
            <Icon icon="heroicons:trash-20-solid" class="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          @click="addPhone"
          class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" />
          Add Phone Number
        </button>
      </div>

      <Text
        id="address"
        v-model="form.address"
        label="Address"
        placeholder="Enter address"
        icon-left="heroicons:map-pin-20-solid"
        :error="errors.address"
        clearable
        required
      />

      <Textarea
        id="description"
        v-model="form.description"
        label="Description"
        placeholder="Enter course description"
        icon-left="heroicons:pencil-20-solid"
        :error="errors.description"
        :rows="4"
        clearable
      />

      <DateInput
        id="date"
        v-model="form.date"
        label="Date"
        placeholder="Select date"
        icon-left="heroicons:calendar-20-solid"
        :error="errors.date"
        clearable
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create Course</span>
        </button>
        <RouterLink
          to="/admin/course"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import Text from "../../../components/input/text.vue";
import Textarea from "../../../components/input/textarea.vue";
import Select from "../../../components/input/select.vue";
import SearchSelect from "../../../components/input/search-select.vue";
import DateInput from "../../../components/input/date.vue";
import { Icon } from "@iconify/vue";
import Heading from "../../../components/heading.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { createCourse } from "../../../api/courses";
import { getTypeCourses } from "../../../api/type-courses";
import type { TypeCourse } from "../../../api/type-courses";
import { getUsers } from "../../../api/users";
import type { User } from "../../../api/users";

const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const courseTypes = ref<TypeCourse[]>([]);
const users = ref<User[]>([]);

const form = ref({
  type_id: null as number | null,
  user_id: null as number | null,
  phone_num: "[]", // JSON array string
  address: "",
  description: "",
  date: "",
});

const errors = ref<{
  type_id?: string;
  user_id?: string;
  phone_num?: string;
  address?: string;
  description?: string;
  date?: string;
}>({});

const courseTypeOptions = ref<{ value: number; label: string }[]>([]);
const userOptions = ref<{ value: number; label: string }[]>([]);

// Phone numbers as array for easier management
const phoneNumbers = ref<string[]>([""]);

// Watch phoneNumbers and update form.phone_num as JSON string
function updatePhoneNumFromArray() {
  const validPhones = phoneNumbers.value.filter((p) => p.trim() !== "");
  form.value.phone_num = JSON.stringify(validPhones);
}

function addPhone() {
  phoneNumbers.value.push("");
}

function removePhone(index: number) {
  if (phoneNumbers.value.length > 1) {
    phoneNumbers.value.splice(index, 1);
    updatePhoneNumFromArray();
  }
}

// Watch phoneNumbers to keep form.phone_num in sync
watch(
  phoneNumbers,
  () => {
    updatePhoneNumFromArray();
  },
  { deep: true }
);

onMounted(async () => {
  try {
    // Load course types
    const typeResponse = await getTypeCourses({ show: 100 });
    courseTypes.value = typeResponse.data || [];
    courseTypeOptions.value = courseTypes.value.map((type) => ({
      value: type.id,
      label: type.name,
    }));

    // Load users
    const userResponse = await getUsers({ show: 100 });
    users.value = userResponse.data || [];
    userOptions.value = users.value.map((user) => ({
      value: user.id,
      label:
        `${user.first_name || ""} ${user.last_name || ""} ${
          user.email || ""
        }`.trim() || `User #${user.id}`,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_num: user.phone_num,
    }));
  } catch (error) {
    console.error("Failed to load data", error);
  }
});

function validateForm() {
  errors.value = {};

  if (!form.value.type_id) {
    errors.value.type_id = "Course type is required";
  }

  if (!form.value.user_id) {
    errors.value.user_id = "User is required";
  }

  // Validate phone numbers
  updatePhoneNumFromArray();
  const phones = phoneNumbers.value.filter((p) => p.trim() !== "");
  if (phones.length === 0) {
    errors.value.phone_num = "At least one phone number is required";
  }

  if (!form.value.address.trim()) {
    errors.value.address = "Address is required";
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.value = {};
  successMessage.value = null;
  errorMessage.value = null;

  try {
    // Update phone_num from array before submitting
    updatePhoneNumFromArray();
    await createCourse({
      type_id: form.value.type_id!,
      user_id: form.value.user_id!,
      phone_num: form.value.phone_num, // Already JSON array string
      address: form.value.address.trim(),
      description: form.value.description?.trim() || undefined,
      date: form.value.date || undefined,
    });

    successMessage.value = "Course created successfully";

    // Reset form
    form.value = {
      type_id: null,
      user_id: null,
      phone_num: "",
      address: "",
      description: "",
      date: "",
    };

    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (error: any) {
    console.error("Failed to create course", error);

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
      "Failed to create course. Please try again.";

    // Auto-hide error message after 3 seconds
    setTimeout(() => {
      errorMessage.value = null;
    }, 3000);
  } finally {
    loading.value = false;
  }
}
</script>
