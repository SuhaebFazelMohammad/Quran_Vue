<template>
  <div class="space-y-6">
    <Heading title="My Profile" link="/admin/dashboard" buttonText="Back" />

    <div
      v-if="fetchError"
      class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-400/15 dark:text-red-200"
    >
      <Icon
        icon="heroicons:exclamation-triangle-20-solid"
        class="mt-0.5 h-5 w-5"
      />
      <div>
        <p class="font-semibold">Unable to load profile</p>
        <p class="text-xs">{{ fetchError }}</p>
      </div>
    </div>

    <div
      v-if="loadingProfile"
      class="surface-card flex items-center gap-3 px-4 py-6 text-sm text-slate-500 dark:text-slate-300"
    >
      <span
        class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-r-transparent"
      ></span>
      Loading profile information...
    </div>

    <div
      v-else-if="profile"
      class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
    >
      <section class="surface-card space-y-6">
        <header class="flex flex-wrap items-center gap-4">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-xl font-semibold text-white shadow-lg shadow-amber-500/20 dark:from-amber-500 dark:to-amber-400"
          >
            {{ initials }}
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
              User ID
            </p>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
              {{ profile.id }}
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ fullName }}
            </p>
          </div>
          <span
            class="surface-pill ml-auto inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold"
          >
            <Icon
              icon="heroicons:shield-check-20-solid"
              class="h-4 w-4 text-amber-500 dark:text-amber-300"
            />
            {{ formattedRole }}
          </span>
        </header>

        <dl class="grid gap-4 sm:grid-cols-2">
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Email
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ profile.email }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Phone
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ profile.phone_num || "Not provided" }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Gender
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ formattedGender }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Birthday
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ formattedBirthday }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              City
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ profile.city || "Not set" }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Address
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ profile.address || "Not provided" }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Listening from
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{
                profile.listening_from || profile.listen_from || "Not provided"
              }}
            </dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt
              class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
            >
              Updated
            </dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">
              {{ lastUpdated }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="surface-card space-y-6">
        <header class="space-y-1">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Update your information
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Edit your profile details below. Fields sitting_id and softDelete
            are handled internally and stay hidden.
          </p>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <div class="grid gap-4 sm:grid-cols-2">
            <Text
              id="first-name"
              v-model="form.first_name"
              label="First name"
              placeholder="Enter first name"
              :error="errors.first_name"
              required
            />
            <Text
              id="last-name"
              v-model="form.last_name"
              label="Last name"
              placeholder="Enter last name"
              :error="errors.last_name"
              required
            />
          </div>

          <Text
            id="profile-email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            :error="errors.email"
            required
          />

          <div class="grid gap-4 sm:grid-cols-2">
            <Text
              id="phone"
              v-model="form.phone_num"
              label="Phone number"
              type="tel"
              placeholder="11-digit number"
              :maxlength="14"
              :error="errors.phone_num"
            />
            <Select
              id="gender"
              v-model="form.gender"
              label="Gender"
              :options="genderOptions"
              placeholder="Select gender"
              :clearable="true"
              :error="errors.gender"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <DateInput
              id="birthday"
              v-model="form.birthday"
              label="Birthday"
              :error="errors.birthday"
              clearable
            />
            <div></div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <Text
              id="city"
              v-model="form.city"
              label="City"
              placeholder="City / Region"
              :error="errors.city"
            />
            <Text
              id="listen-from"
              v-model="form.listen_from"
              label="Listening from"
              placeholder="Source"
              :error="errors.listen_from"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label
              for="address"
              class="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Address
            </label>
            <textarea
              id="address"
              v-model="form.address"
              rows="4"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="Street, district..."
            ></textarea>
            <p
              v-if="errors.address"
              class="text-xs text-red-600 dark:text-red-400"
            >
              {{ errors.address }}
            </p>
          </div>

          <transition name="fade">
            <div
              v-if="successMessage"
              class="fixed bottom-4 right-4 z-50 max-w-xs"
            >
              <SuccessMessage
                title="Profile updated"
                :message="successMessage"
              />
            </div>
          </transition>

          <ErrorMessage
            v-if="errors.general"
            title="Update failed"
            :message="errors.general"
          />

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              :disabled="saving || !isDirty"
              class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                v-if="saving"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
              ></span>
              <span v-else>Save changes</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
              :disabled="!isDirty || saving"
              @click="resetForm"
            >
              <Icon icon="heroicons:arrow-path-20-solid" class="h-4 w-4" />
              Reset
            </button>

            <span class="ml-auto text-xs text-slate-500 dark:text-slate-400">
              Last updated {{ lastUpdated }}
            </span>
          </div>
        </form>
      </section>
    </div>

    <div
      v-else
      class="surface-card px-4 py-6 text-sm text-slate-500 dark:text-slate-300"
    >
      No profile information available for your account yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { getCurrentUser } from "../../api/auth";
import { updateProfile, type UpdateUserData, type User } from "../../api/users";
import Heading from "../../components/heading.vue";
import Select, { type SelectOption } from "../../components/input/select.vue";
import Text from "../../components/input/text.vue";
import DateInput from "../../components/input/date.vue";
import SuccessMessage from "../../components/message/success.vue";
import ErrorMessage from "../../components/message/error.vue";
import { useUserStore } from "../../stores/userStore";

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone_num: string;
  gender: string;
  birthday: string;
  city: string;
  address: string;
  listen_from: string;
};

type FormErrors = Partial<Record<keyof ProfileForm, string>> & {
  general?: string;
};

const baseGenderOptions: SelectOption<string>[] = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

const userStore = useUserStore();
const { user: userRef } = storeToRefs(userStore);

const profile = ref<User | null>((userRef.value as User | null) ?? null);
const form = ref<ProfileForm>(createFormFromUser(profile.value));
const originalForm = ref<ProfileForm>({ ...form.value });

const loadingProfile = ref(!profile.value);
const saving = ref(false);
const successMessage = ref("");
const successTimeoutId = ref<number | null>(null);
const fetchError = ref("");
const errors = ref<FormErrors>({});

const genderOptions = computed(() => {
  const current = form.value.gender;
  const exists = baseGenderOptions.some((option) => option.value === current);
  return exists || !current
    ? baseGenderOptions
    : [...baseGenderOptions, { value: current, label: current }];
});

const initials = computed(() => {
  const first = profile.value?.first_name?.charAt(0) ?? "";
  const last = profile.value?.last_name?.charAt(0) ?? "";
  const letters = `${first}${last}`.toUpperCase();
  if (letters) return letters;
  const fallback = profile.value?.email?.charAt(0)?.toUpperCase();
  return fallback || "U";
});

const fullName = computed(() => {
  const first = profile.value?.first_name ?? "";
  const last = profile.value?.last_name ?? "";
  return `${first} ${last}`.trim() || profile.value?.email || "Unnamed user";
});

const formattedBirthday = computed(() =>
  // Prefer backend's date_of_birth field, fall back to birthday if present
  formatDateFromISO(
    (profile.value?.date_of_birth as string | null | undefined) ??
      (profile.value?.birthday as string | null | undefined) ??
      null
  )
);

const formattedGender = computed(() => {
  const raw = profile.value?.gender;
  if (raw === "1") return "Male";
  if (raw === "2") return "Female";
});

const formattedRole = computed(() => {
  const raw = profile.value?.role;
  if (raw === "1") return "Admin";
  if (raw === "2") return "Teacher";
  if (raw === "3") return "Student";
  return (raw as string) || "Role not set";
});

const lastUpdated = computed(() =>
  formatDateFromISO(profile.value?.updated_at ?? null)
);

const isDirty = computed(
  () => JSON.stringify(form.value) !== JSON.stringify(originalForm.value)
);

watch(userRef, (next) => {
  if (next) {
    profile.value = next as User;
    form.value = createFormFromUser(profile.value);
    originalForm.value = { ...form.value };
  }
});

watch(
  form,
  () => {
    // Clear success banner only when the user manually changes something
    // after a successful save (not on our own programmatic updates)
    if (successMessage.value && isDirty.value) {
      successMessage.value = "";
    }
  },
  { deep: true }
);

onMounted(async () => {
  await loadProfile();
});

async function loadProfile() {
  loadingProfile.value = true;
  fetchError.value = "";

  try {
    const latest = (await getCurrentUser()) as User;
    profile.value = latest;
    form.value = createFormFromUser(latest);
    originalForm.value = { ...form.value };
    userStore.updateUser(latest);
  } catch (error) {
    fetchError.value = extractErrorMessage(error);
  } finally {
    loadingProfile.value = false;
  }
}

function createFormFromUser(user: User | null): ProfileForm {
  return {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    email: user?.email ?? "",
    phone_num: user?.phone_num ?? "",
    // store gender as string code ("1" for male, "2" for female, etc.)
    gender: user?.gender != null ? String(user.gender) : "",
    // frontend field "birthday" maps to backend "date_of_birth"
    birthday:
      (user?.date_of_birth as string | undefined) ??
      (user?.birthday as string | undefined) ??
      "",
    city: user?.city ?? "",
    address: user?.address ?? "",
    listen_from:
      (user?.listening_from as string | undefined) ?? user?.listen_from ?? "",
  };
}

function resetForm() {
  form.value = { ...originalForm.value };
  errors.value = {};
}

function validateForm() {
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
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.value.phone_num.trim()) {
    nextErrors.phone_num = "Phone number is required.";
  } else {
    const digitsOnly = form.value.phone_num.replace(/\D/g, "");
    if (digitsOnly.length !== 11) {
      nextErrors.phone_num = "Phone number must be exactly 11 digits.";
    }
  }

  if (form.value.birthday && Number.isNaN(Date.parse(form.value.birthday))) {
    nextErrors.birthday = "Enter a valid date.";
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

async function handleSubmit() {
  if (!profile.value || saving.value) return;
  if (!validateForm()) return;

  saving.value = true;
  successMessage.value = "";
  errors.value = { ...errors.value, general: "" };

  const payload: UpdateUserData = {
    first_name: form.value.first_name.trim(),
    last_name: form.value.last_name.trim(),
    email: form.value.email.trim(),
    // send only digits to match Laravel digits:11 validation
    phone_num: form.value.phone_num.replace(/\D/g, "") || undefined,
    gender: form.value.gender || undefined,
    // send backend field name date_of_birth
    date_of_birth: form.value.birthday || null,
    city: form.value.city.trim() || undefined,
    address: form.value.address.trim() || undefined,
    listening_from: form.value.listen_from.trim() || undefined,
  };

  try {
    const updated = await updateProfile(payload);
    profile.value = updated;
    userStore.updateUser(updated);
    originalForm.value = { ...createFormFromUser(updated) };
    form.value = { ...originalForm.value };
    successMessage.value = "Profile information has been updated.";

    // Auto-hide success message after 3 seconds
    if (successTimeoutId.value !== null) {
      clearTimeout(successTimeoutId.value);
    }
    successTimeoutId.value = window.setTimeout(() => {
      successMessage.value = "";
      successTimeoutId.value = null;
    }, 3000);
  } catch (error: any) {
    // Default generic error message for the banner
    let generalMessage =
      "Something went wrong while saving your profile. Please check your inputs and try again.";

    // If backend returned Laravel validation errors, map them to fields
    if (error?.response?.status === 422 && error.response.data?.errors) {
      const backendErrors = error.response.data.errors as Record<
        string,
        string[]
      >;

      const fieldErrors: FormErrors = { ...errors.value };

      Object.entries(backendErrors).forEach(([field, messages]) => {
        const key = field as keyof ProfileForm;
        if (key in fieldErrors) {
          fieldErrors[key] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        }
      });

      errors.value = {
        ...fieldErrors,
        general: generalMessage,
      };
    } else {
      errors.value = {
        ...errors.value,
        general: generalMessage,
      };
    }
  } finally {
    saving.value = false;
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function extractErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object"
  ) {
    const response = (error as any).response;
    return (
      response.data?.message ||
      response.data?.error ||
      "Server rejected the request. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred. Please try again.";
}

function formatDateFromISO(iso?: string | null) {
  if (!iso) return "Not recorded";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: iso.length > 10 ? "short" : undefined,
  }).format(date);
}
</script>
