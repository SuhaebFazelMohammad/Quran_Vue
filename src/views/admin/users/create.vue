<template>
  <div class="space-y-6">
    <Heading title="Create User" link="/admin/users" buttonText="Back" />

    <form
      @submit.prevent="handleSubmit"
      class="surface-card w-full space-y-6"
      novalidate
    >
      <SuccessMessage
        v-if="successMessage"
        :title="successMessage"
        message="The user has been created successfully."
      />

      <ErrorMessage
        v-if="errorMessage"
        :title="errorMessage"
        message="Please check the form and try again."
      />

      <div>
        <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
          User information
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Enter the details for the new user account.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <Text
          id="first_name"
          v-model="form.first_name"
          label="First name"
          placeholder="Enter first name"
          icon-left="heroicons:user-circle-20-solid"
          :error="errors.first_name"
          clearable
          required
        />

        <Text
          id="last_name"
          v-model="form.last_name"
          label="Last name"
          placeholder="Enter last name"
          icon-left="heroicons:user-circle-20-solid"
          :error="errors.last_name"
          clearable
          required
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <Text
          id="email"
          v-model="form.email"
          type="email"
          label="Email address"
          placeholder="Enter email address"
          icon-left="heroicons:envelope-open-20-solid"
          :error="errors.email"
          hint="Used for account login and notifications"
          autocomplete="email"
          clearable
          required
        />

        <Select
          id="role"
          v-model="form.role"
          label="Role"
          :options="roleOptions"
          placeholder="Select role"
          :clearable="false"
          :searchable="false"
          :error="errors.role"
          hint="Choose the appropriate permission level"
          required
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <Select
          id="gender"
          v-model="form.gender"
          label="Gender"
          :options="genderOptions"
          placeholder="Select gender"
          :clearable="true"
          :searchable="false"
          :error="errors.gender"
        />

        <Text
          id="phone_num"
          v-model="form.phone_num"
          type="tel"
          label="Phone number"
          placeholder="Enter 11 digits"
          icon-left="heroicons:phone-20-solid"
          :error="errors.phone_num"
          hint="Must be exactly 11 digits"
          clearable
          autocomplete="tel"
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <DateInput
          id="date_of_birth"
          v-model="form.date_of_birth"
          label="Date of birth"
          :error="errors.date_of_birth"
          clearable
        />

        <Text
          id="city"
          v-model="form.city"
          label="City"
          placeholder="Enter city"
          icon-left="heroicons:map-pin-20-solid"
          :error="errors.city"
          clearable
        />
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <Text
          id="listening_from"
          v-model="form.listening_from"
          label="Listening from"
          placeholder="Enter listening source"
          icon-left="heroicons:ear-20-solid"
          :error="errors.listening_from"
          clearable
        />

        <div class="flex flex-col gap-1.5">
          <label for="address" class="text-sm font-medium text-slate-700"
            >Address</label
          >
          <textarea
            id="address"
            v-model="form.address"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
            placeholder="Enter full address..."
          ></textarea>
          <div class="text-xs">
            <p v-if="errors.address" class="text-red-600 dark:text-red-400">
              {{ errors.address }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <PasswordInput
          id="password"
          v-model="form.password"
          label="Password"
          placeholder="Enter password"
          icon-left="heroicons:lock-closed-20-solid"
          :error="errors.password"
          hint="Must be at least 8 characters"
          clearable
          autocomplete="new-password"
          required
        />

        <PasswordInput
          id="password_confirmation"
          v-model="form.password_confirmation"
          label="Confirm Password"
          placeholder="Confirm password"
          icon-left="heroicons:key-20-solid"
          :error="errors.password_confirmation"
          hint="Must match password"
          clearable
          autocomplete="new-password"
          required
        />
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span
            v-if="loading"
            class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
          ></span>
          <span v-else>Create User</span>
        </button>
        <RouterLink
          to="/admin/users"
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
import PasswordInput from "../../../components/input/password.vue";
import Select, {
  type SelectOption,
} from "../../../components/input/select.vue";
import DateInput from "../../../components/input/date.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import Heading from "../../../components/heading.vue";
import { createUser, type CreateUserData } from "../../../api/users";

const roleOptions: SelectOption<string>[] = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Moderator" },
  { value: "3", label: "User" },
];

const genderOptions: SelectOption<string>[] = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

const loading = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const messageTimeoutId = ref<number | null>(null);

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string | undefined;
  phone_num: string;
  gender: string | undefined;
  city: string;
  address: string;
  date_of_birth: string;
  listening_from: string;
}

type FormErrors = Partial<
  Record<
    | "first_name"
    | "last_name"
    | "email"
    | "password"
    | "password_confirmation"
    | "role"
    | "phone_num"
    | "gender"
    | "city"
    | "address"
    | "date_of_birth"
    | "listening_from",
    string
  >
>;

const form = ref<UserForm>({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: undefined,
  phone_num: "",
  gender: undefined,
  city: "",
  address: "",
  date_of_birth: "",
  listening_from: "",
});

const errors = ref<FormErrors>({});

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateForm(): boolean {
  const nextErrors: FormErrors = {};

  if (!form.value.first_name.trim()) {
    nextErrors.first_name = "First name is required.";
  }

  if (!form.value.last_name.trim()) {
    nextErrors.last_name = "Last name is required.";
  }

  if (!form.value.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!isValidEmail(form.value.email)) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (!form.value.role) {
    nextErrors.role = "Select a role for this user.";
  }

  if (!form.value.password) {
    nextErrors.password = "Password is required.";
  } else if (form.value.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  }

  if (!form.value.password_confirmation) {
    nextErrors.password_confirmation = "Please confirm your password.";
  } else if (form.value.password !== form.value.password_confirmation) {
    nextErrors.password_confirmation = "Passwords do not match.";
  }

  if (form.value.phone_num.trim()) {
    // Remove all non-digit characters for validation
    const phoneDigits = form.value.phone_num.replace(/\D/g, "");
    if (phoneDigits.length !== 11) {
      nextErrors.phone_num = "Phone number must be exactly 11 digits.";
    }
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  clearMessages();
  errors.value = {};

  try {
    // Clean phone number: remove all non-digit characters before sending
    const cleanPhoneNum = form.value.phone_num
      ? form.value.phone_num.replace(/\D/g, "")
      : undefined;

    const createData: CreateUserData = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      role: form.value.role || undefined,
      phone_num: cleanPhoneNum || undefined,
      gender: form.value.gender || undefined,
      city: form.value.city || undefined,
      address: form.value.address || undefined,
      date_of_birth: form.value.date_of_birth || undefined,
      listening_from: form.value.listening_from || undefined,
    };

    await createUser(createData);

    showSuccessMessage("User created successfully");

    // Reset form after successful creation
    form.value = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: undefined,
      phone_num: "",
      gender: undefined,
      city: "",
      address: "",
      date_of_birth: "",
      listening_from: "",
    };
    errors.value = {};
  } catch (error: any) {
    console.error("Failed to create user", error);

    // Handle validation errors from backend
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

    showErrorMessage(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to create user. Please try again."
    );
  } finally {
    loading.value = false;
  }
}

function clearMessages() {
  successMessage.value = null;
  errorMessage.value = null;
  if (messageTimeoutId.value !== null) {
    clearTimeout(messageTimeoutId.value);
    messageTimeoutId.value = null;
  }
}

function showSuccessMessage(message: string) {
  clearMessages();
  successMessage.value = message;
  messageTimeoutId.value = window.setTimeout(() => {
    successMessage.value = null;
    messageTimeoutId.value = null;
  }, 3000);
}

function showErrorMessage(message: string) {
  clearMessages();
  errorMessage.value = message;
  messageTimeoutId.value = window.setTimeout(() => {
    errorMessage.value = null;
    messageTimeoutId.value = null;
  }, 3000);
}
</script>

<style scoped></style>
