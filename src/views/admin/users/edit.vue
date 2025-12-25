<template>
  <div class="space-y-6">
    <Heading title="Edit User" link="/admin/users" buttonText="Back" />

    <div v-if="notFound" class="surface-card p-8 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600"
      >
        <Icon icon="heroicons:exclamation-triangle-20-solid" class="h-6 w-6" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-slate-800">User not found</h2>
      <p class="mt-2 text-sm text-slate-500">
        The user you are looking for does not exist or was removed. Please go
        back to the users list and try again.
      </p>
      <RouterLink
        to="/admin/users"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 active:translate-y-px"
      >
        <Icon icon="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
        Back to Users
      </RouterLink>
    </div>

    <div v-else-if="loading" class="surface-card relative min-h-[400px]">
      <Loading />
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <form
        @submit.prevent="handleSubmit"
        class="surface-card space-y-6 relative"
        novalidate
      >
        <Loading v-if="loading" />
        <div class="flex flex-wrap items-center gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              User information
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Update personal details and manage access for this administrator.
            </p>
          </div>
          <span
            class="surface-pill inline-flex items-center gap-2 px-3 py-1 text-xs font-medium"
            :class="statusBadgeClass"
          >
            <span
              class="h-2 w-2 rounded-full"
              :class="
                isActive
                  ? 'bg-emerald-500 dark:bg-emerald-300'
                  : 'bg-slate-400 dark:bg-slate-500'
              "
            ></span>
            {{ isActive ? "Active" : "Inactive" }}
          </span>
          <span class="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Created {{ formattedCreatedAt }}
          </span>
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
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
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
          />

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
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <Text
            id="phone_num"
            v-model="form.phone_num"
            type="tel"
            label="Phone number"
            placeholder="+966 500 000 000"
            icon-left="heroicons:phone-20-solid"
            :error="errors.phone_num"
            hint="Optional — include country code"
            clearable
            autocomplete="tel"
          />

          <DateInput
            id="date_of_birth"
            v-model="form.date_of_birth"
            label="Date of birth"
            :error="errors.date_of_birth"
            clearable
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <Text
            id="city"
            v-model="form.city"
            label="City"
            placeholder="Enter city"
            icon-left="heroicons:map-pin-20-solid"
            :error="errors.city"
            clearable
          />

          <Text
            id="listening_from"
            v-model="form.listening_from"
            label="Listening from"
            placeholder="Enter listening source"
            icon-left="heroicons:ear-20-solid"
            :error="errors.listening_from"
            clearable
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="address" class="text-sm font-medium text-slate-700"
            >Address</label
          >
          <textarea
            id="address"
            v-model="form.address"
            rows="4"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
            placeholder="Enter full address..."
          ></textarea>
          <div class="text-xs">
            <p v-if="errors.address" class="text-red-600 dark:text-red-400">
              {{ errors.address }}
            </p>
          </div>
        </div>

        <Image
          v-if="showImageInput"
          id="image"
          v-model="form.image"
          label="Profile Image"
          placeholder="Upload profile image"
          :error="errors.image"
          :max-size-mb="5"
          :current-image="currentImageUrl"
        />

        <div class="surface-panel space-y-4 px-4 py-4">
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <p
                class="text-sm font-semibold text-slate-700 dark:text-slate-200"
              >
                Account status
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ statusDescription }}
              </p>
            </div>
            <button
              type="button"
              class="relative inline-flex h-7 w-14 items-center rounded-full transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 dark:focus-visible:ring-amber-400/20"
              :class="
                isActive
                  ? 'bg-emerald-500/80 dark:bg-emerald-400/60'
                  : 'bg-slate-300 dark:bg-slate-700'
              "
              :aria-pressed="isActive"
              @click="toggleStatus"
            >
              <span
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
                :class="isActive ? 'translate-x-7' : 'translate-x-2'"
              ></span>
            </button>
            <span
              class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition"
              :class="statusBadgeClass"
            >
              <Icon
                :icon="
                  isActive
                    ? 'heroicons:check-badge-20-solid'
                    : 'heroicons:clock-20-solid'
                "
                class="h-4 w-4"
              />
              {{ isActive ? "Active" : "Temporarily paused" }}
            </span>
          </div>
        </div>

        <SuccessMessage
          v-if="successMessage"
          :title="successMessage"
          message="The user information has been updated successfully."
        />

        <ErrorMessage
          v-if="errorMessage"
          :title="errorMessage"
          message="Please check the form and try again."
        />

        <div class="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            :disabled="loading || !isDirty"
            class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              v-if="loading"
              class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
            ></span>
            <span v-else> Save changes </span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
            :disabled="!isDirty || loading"
            @click="resetForm"
          >
            <Icon icon="heroicons:arrow-path-20-solid" class="h-4 w-4" />
            Reset
          </button>

          <RouterLink
            to="/admin/users"
            class="inline-flex items-center gap-2 rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-100 dark:text-slate-300 dark:hover:text-amber-200"
          >
            Cancel
          </RouterLink>

          <span class="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Last saved {{ formattedLastSaved }}
          </span>
        </div>
      </form>

      <aside class="space-y-4">
        <div class="surface-card">
          <div class="flex items-center gap-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700 dark:bg-amber-400/20 dark:text-amber-200"
            >
              {{ initials }}
            </div>
            <div>
              <p
                class="text-sm font-semibold text-slate-700 dark:text-slate-100"
              >
                {{
                  [form.first_name, form.last_name].filter(Boolean).join(" ") ||
                  "Unnamed user"
                }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ form.email || "No email set" }}
              </p>
            </div>
          </div>

          <div
            class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300"
          >
            <div
              class="flex items-center justify-between text-slate-500 dark:text-slate-400"
            >
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:shield-check-20-solid"
                  class="h-4 w-4 text-emerald-500"
                />
                Role
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{
                  form.role
                    ? roleLabelById[form.role] || form.role
                    : "Not assigned"
                }}
              </span>
            </div>
            <div
              class="flex items-center justify-between text-slate-500 dark:text-slate-400"
            >
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:map-pin-20-solid"
                  class="h-4 w-4 text-amber-500"
                />
                Location
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ form.city || "Not specified" }}
              </span>
            </div>
            <div
              class="flex items-center justify-between text-slate-500 dark:text-slate-400"
            >
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:device-phone-mobile-20-solid"
                  class="h-4 w-4 text-sky-500"
                />
                Phone
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ form.phone_num || "Not provided" }}
              </span>
            </div>
            <div
              class="flex items-center justify-between text-slate-500 dark:text-slate-400"
            >
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:clock-20-solid"
                  class="h-4 w-4 text-purple-500"
                />
                Last login
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ formattedLastLogin }}
              </span>
            </div>
          </div>

          <div
            v-if="form.address"
            class="mt-5 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Address
            </p>
            <p class="mt-2 leading-relaxed whitespace-pre-line">
              {{ form.address }}
            </p>
          </div>
        </div>

        <div class="surface-card">
          <div class="flex items-center justify-between">
            <h3
              class="text-sm font-semibold text-slate-700 dark:text-slate-100"
            >
              Recent activity
            </h3>
            <span class="text-xs text-slate-400 dark:text-slate-500"
              >Last {{ activity.length }} events</span
            >
          </div>
          <ul class="mt-4 space-y-3">
            <li
              v-for="item in activity"
              :key="item.id"
              class="flex items-start gap-3 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <span
                class="mt-1 h-2.5 w-2.5 rounded-full"
                :class="activityToneClass(item.tone)"
              ></span>
              <div>
                <p
                  class="text-sm font-medium text-slate-700 dark:text-slate-100"
                >
                  {{ item.title }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ item.subtitle }}
                </p>
              </div>
            </li>
            <li
              v-if="activity.length === 0"
              class="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              No recorded activity for this user yet.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Heading from "../../../components/heading.vue";
import Loading from "../../../components/loading.vue";
import Select, {
  type SelectOption,
} from "../../../components/input/select.vue";
import Text from "../../../components/input/text.vue";
import DateInput from "../../../components/input/date.vue";
import Image from "../../../components/input/image.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { getUser, updateUser, type User } from "../../../api/users";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  tone?: "positive" | "neutral" | "warning";
}

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  role: string | undefined;
  phone_num: string;
  city: string;
  gender: string | undefined;
  address: string;
  date_of_birth: string;
  listening_from: string;
  deleted_at: string | null;
  image: File | string | null;
}

type FormErrors = Partial<
  Record<
    | "first_name"
    | "last_name"
    | "email"
    | "role"
    | "phone_num"
    | "city"
    | "gender"
    | "address"
    | "date_of_birth"
    | "listening_from"
    | "deleted_at"
    | "image",
    string
  >
>;

const roleOptions: SelectOption<string>[] = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Moderator" },
  { value: "3", label: "User" },
];

const genderOptions: SelectOption<string>[] = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

const roleLabelById: Record<string, string> = {
  "1": "Admin",
  "2": "Moderator",
  "3": "User",
};

const route = useRoute();

const loading = ref(false);
const notFound = ref(false);
const successMessage = ref("");
const errorMessage = ref<string | null>(null);
const errors = ref<FormErrors>({});

const form = ref<UserForm>({
  first_name: "",
  last_name: "",
  email: "",
  role: undefined,
  phone_num: "",
  city: "",
  gender: undefined,
  address: "",
  date_of_birth: "",
  listening_from: "",
  deleted_at: null,
  image: null,
});

// Show image input only for admin (1) or moderator (2) roles
const showImageInput = computed(() => {
  return form.value.role === "1" || form.value.role === "2";
});

// Current image URL from backend (for display)
const currentImageUrl = computed(() => {
  if (form.value.image instanceof File) {
    return null; // New file selected, don't show old image
  }
  if (typeof form.value.image === "string" && form.value.image) {
    return form.value.image;
  }
  return null;
});

const originalForm = ref<UserForm | null>(null);
const activity = ref<ActivityItem[]>([]);
const lastSavedAt = ref<Date | null>(null);
const lastLogin = ref<Date | null>(null);
const createdAt = ref<Date | null>(null);
const userId = ref<number | null>(null);

const initials = computed(() => {
  const name = [form.value.first_name, form.value.last_name]
    .filter(Boolean)
    .join(" ");
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
});

const isActive = computed(() => form.value.deleted_at === null);

const statusDescription = computed(() =>
  isActive.value
    ? "Active users can log in and manage their assigned responsibilities."
    : "Inactive users cannot access the dashboard until reactivated."
);

const statusBadgeClass = computed(() =>
  isActive.value
    ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200"
    : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
);

const isDirty = computed(() => {
  if (!originalForm.value) return false;
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

const formattedLastSaved = computed(() => formatDate(lastSavedAt.value));
const formattedLastLogin = computed(() => formatDate(lastLogin.value));
const formattedCreatedAt = computed(() => formatDate(createdAt.value));

watch(
  () => route.params.id,
  () => {
    loadUser();
  },
  { immediate: true }
);

watch(
  form,
  () => {
    if (!loading.value && successMessage.value) {
      successMessage.value = "";
    }
  },
  { deep: true }
);

async function loadUser() {
  const idParam = Number(route.params.id);
  if (Number.isNaN(idParam)) {
    notFound.value = true;
    loading.value = false;
    return;
  }

  userId.value = idParam;

  try {
    loading.value = true;
    notFound.value = false;
    const backendUser: User = await getUser(idParam);

    const [first_name = "", last_name = ""] = (
      [backendUser.first_name, backendUser.last_name]
        .filter(Boolean)
        .join(" ") || backendUser.email
    ).split(" ", 2);

    const rawRole: string | number | undefined =
      (backendUser as any).role_id ?? backendUser.role;
    const roleId = rawRole != null ? String(rawRole) : "3";

    const rawGender: string | number | undefined = backendUser.gender;
    const genderId = rawGender != null ? String(rawGender) : undefined;

    // Handle image: convert number to string, keep string as is, null stays null
    let imageValue: File | string | null = null;
    if (backendUser.image !== null && backendUser.image !== undefined) {
      if (typeof backendUser.image === "number") {
        imageValue = String(backendUser.image);
      } else if (typeof backendUser.image === "string") {
        imageValue = backendUser.image;
      }
    }

    const userForm: UserForm = {
      first_name: backendUser.first_name ?? first_name,
      last_name: backendUser.last_name ?? last_name,
      email: backendUser.email,
      role: roleId,
      phone_num: backendUser.phone_num ?? "",
      city: backendUser.city ?? "",
      gender: genderId,
      address: backendUser.address ?? "",
      date_of_birth: backendUser.date_of_birth ?? "",
      listening_from: backendUser.listening_from ?? "",
      deleted_at: backendUser.softDelete ?? null,
      image: imageValue,
    };

    form.value = { ...userForm };
    originalForm.value = { ...userForm };
    activity.value = [];
    lastSavedAt.value = backendUser.updated_at
      ? new Date(backendUser.updated_at)
      : null;
    lastLogin.value = (backendUser as any).last_login
      ? new Date((backendUser as any).last_login)
      : null;
    createdAt.value = backendUser.created_at
      ? new Date(backendUser.created_at)
      : null;
    successMessage.value = "";
    errorMessage.value = null;
    errors.value = {};
    notFound.value = false;
  } catch (error) {
    console.error("Failed to load user", error);
    notFound.value = true;
    errorMessage.value = "Failed to load user data";
  } finally {
    loading.value = false;
  }
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

  if (!userId.value) {
    errorMessage.value = "User ID is missing";
    return;
  }

  loading.value = true;
  successMessage.value = "";
  errorMessage.value = null;
  errors.value = {};

  try {
    // Clean phone number: remove all non-digit characters before sending
    const cleanPhoneNum = form.value.phone_num
      ? form.value.phone_num.replace(/\D/g, "")
      : undefined;

    // If image is a File, use FormData; otherwise use regular JSON
    const hasImageFile = form.value.image instanceof File;

    if (hasImageFile) {
      const formData = new FormData();
      formData.append("first_name", form.value.first_name);
      formData.append("last_name", form.value.last_name);
      formData.append("email", form.value.email);
      if (form.value.role) formData.append("role", form.value.role);
      if (cleanPhoneNum) formData.append("phone_num", cleanPhoneNum);
      if (form.value.city) formData.append("city", form.value.city);
      if (form.value.gender) formData.append("gender", form.value.gender);
      if (form.value.address) formData.append("address", form.value.address);
      if (form.value.date_of_birth)
        formData.append("date_of_birth", form.value.date_of_birth);
      if (form.value.listening_from)
        formData.append("listening_from", form.value.listening_from);
      if (form.value.image instanceof File) {
        formData.append("image", form.value.image);
      }

      // Handle soft delete status change
      const originalDeletedAt = originalForm.value?.deleted_at ?? null;
      const currentDeletedAt = form.value.deleted_at;

      if (currentDeletedAt !== originalDeletedAt) {
        if (currentDeletedAt === null) {
          formData.append("deleted_at", "");
        } else {
          formData.append(
            "deleted_at",
            currentDeletedAt || new Date().toISOString()
          );
        }
      }

      await updateUser(userId.value, formData as any);
    } else {
      const updateData: any = {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        role: form.value.role,
        phone_num: cleanPhoneNum || undefined,
        city: form.value.city || undefined,
        gender: form.value.gender || undefined,
        address: form.value.address || undefined,
        date_of_birth: form.value.date_of_birth || undefined,
        listening_from: form.value.listening_from || undefined,
      };

      // Handle soft delete status change
      const originalDeletedAt = originalForm.value?.deleted_at ?? null;
      const currentDeletedAt = form.value.deleted_at;

      // If deleted_at changed, we need to handle it
      // If current is null and original was not null, restore user
      // If current is not null and original was null, soft delete user
      if (currentDeletedAt !== originalDeletedAt) {
        if (currentDeletedAt === null) {
          // Restore user - set deleted_at to null
          updateData.deleted_at = null;
        } else {
          // Soft delete user - set deleted_at to current timestamp
          updateData.deleted_at = currentDeletedAt || new Date().toISOString();
        }
      }

      await updateUser(userId.value, updateData);
    }

    lastSavedAt.value = new Date();
    successMessage.value = "User details have been updated successfully.";
    if (originalForm.value) {
      originalForm.value = { ...form.value };
    }

    // Reload user data to get updated timestamps
    await loadUser();
  } catch (error: any) {
    console.error("Failed to update user", error);

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

    errorMessage.value =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update user. Please try again.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  if (!originalForm.value) return;
  form.value = { ...originalForm.value };
  errors.value = {};
}

function toggleStatus() {
  // If deleted_at is null (active), set it to current date (inactive)
  // If deleted_at is not null (inactive), set it to null (active/restore)
  if (form.value.deleted_at === null) {
    // When turning off, automatically set to today's date
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    form.value.deleted_at = today.toISOString();
  } else {
    // When turning on, restore user
    form.value.deleted_at = null;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function activityToneClass(tone?: ActivityItem["tone"]) {
  switch (tone) {
    case "positive":
      return "bg-emerald-400";
    case "warning":
      return "bg-amber-400";
    default:
      return "bg-slate-300";
  }
}
</script>

<style scoped></style>
