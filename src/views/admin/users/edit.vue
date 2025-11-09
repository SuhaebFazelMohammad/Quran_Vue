<template>
  <div class="space-y-6">
    <Heading title="Edit User" link="/users" buttonText="Back" />

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
        to="/users"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 active:translate-y-px"
      >
        <Icon icon="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
        Back to Users
      </RouterLink>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <form
        @submit.prevent="handleSubmit"
        class="surface-card space-y-6"
        novalidate
      >
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
              :class="form.isActive ? 'bg-emerald-500 dark:bg-emerald-300' : 'bg-slate-400 dark:bg-slate-500'"
            ></span>
            {{ form.isActive ? "Active" : "Inactive" }}
          </span>
          <span class="ml-auto text-xs text-slate-500 dark:text-slate-400">
            Created {{ formattedCreatedAt }}
          </span>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <Text
            id="name"
            v-model="form.name"
            label="Full name"
            placeholder="Enter full name"
            icon-left="heroicons:user-circle-20-solid"
            :error="errors.name"
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

          <Text
            id="phone"
            v-model="form.phone"
            type="tel"
            label="Phone number"
            placeholder="+966 500 000 000"
            icon-left="heroicons:phone-20-solid"
            :error="errors.phone"
            hint="Optional — include country code"
            clearable
            autocomplete="tel"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <Text
            id="location"
            v-model="form.location"
            label="Location"
            placeholder="City, Country"
            icon-left="heroicons:map-pin-20-solid"
            :error="errors.location"
            clearable
          />

          <div class="flex flex-col gap-1.5">
            <label for="notes" class="text-sm font-medium text-slate-700"
              >Notes</label
            >
            <textarea
              id="notes"
              v-model="form.notes"
              rows="4"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="Add a short internal note about this user..."
              maxlength="280"
            ></textarea>
            <div class="text-xs">
              <p v-if="errors.notes" class="text-red-600 dark:text-red-400">
                {{ errors.notes }}
              </p>
              <p v-else class="text-slate-500 dark:text-slate-400">
                {{ form.notes.length }}/280 characters
              </p>
            </div>
          </div>
        </div>

        <div
          class="surface-panel flex flex-wrap items-center gap-4 px-4 py-4"
        >
          <div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Account status
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ statusDescription }}
            </p>
          </div>
          <button
            type="button"
            class="relative inline-flex h-7 w-14 items-center rounded-full transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 dark:focus-visible:ring-amber-400/20"
            :class="form.isActive ? 'bg-emerald-500/80 dark:bg-emerald-400/60' : 'bg-slate-300 dark:bg-slate-700'"
            :aria-pressed="form.isActive"
            @click="toggleStatus"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
              :class="form.isActive ? 'translate-x-7' : 'translate-x-2'"
            ></span>
          </button>
          <span
            class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition"
            :class="statusBadgeClass"
          >
            <Icon
              :icon="
                form.isActive
                  ? 'heroicons:check-badge-20-solid'
                  : 'heroicons:clock-20-solid'
              "
              class="h-4 w-4"
            />
            {{ form.isActive ? "Active" : "Temporarily paused" }}
          </span>
        </div>

        <div
          v-if="successMessage"
          class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200"
        >
          <Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-5 w-5" />
          <div>
            <p class="font-medium">Changes saved</p>
            <p class="text-xs text-emerald-600/80">{{ successMessage }}</p>
          </div>
        </div>

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
            to="/users"
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
              <p class="text-sm font-semibold text-slate-700 dark:text-slate-100">
                {{ form.name || "Unnamed user" }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ form.email || "No email set" }}
              </p>
            </div>
          </div>

          <div class="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:shield-check-20-solid"
                  class="h-4 w-4 text-emerald-500"
                />
                Role
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ form.role || "Not assigned" }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:map-pin-20-solid"
                  class="h-4 w-4 text-amber-500"
                />
                Location
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ form.location || "Not specified" }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-2">
                <Icon
                  icon="heroicons:device-phone-mobile-20-solid"
                  class="h-4 w-4 text-sky-500"
                />
                Phone
              </span>
              <span class="font-medium text-slate-700 dark:text-slate-100">
                {{ form.phone || "Not provided" }}
              </span>
            </div>
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
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
            v-if="form.notes"
            class="mt-5 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Internal notes
            </p>
            <p class="mt-2 leading-relaxed">
              {{ form.notes }}
            </p>
          </div>
        </div>

        <div class="surface-card">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100">
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
                <p class="text-sm font-medium text-slate-700 dark:text-slate-100">
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
import Select, {
  type SelectOption,
} from "../../../components/input/select.vue";
import Text from "../../../components/input/text.vue";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  tone?: "positive" | "neutral" | "warning";
}

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  activity?: ActivityItem[];
}

interface UserForm {
  name: string;
  email: string;
  role: string | undefined;
  phone: string;
  location: string;
  notes: string;
  isActive: boolean;
}

type FormErrors = Partial<
  Record<"name" | "email" | "role" | "phone" | "location" | "notes", string>
>;

const roleOptions: SelectOption<string>[] = [
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Moderator", label: "Moderator" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
  { value: "Guest", label: "Guest" },
  { value: "Member", label: "Member" },
];

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "Ali Kareem",
    email: "ali@example.com",
    role: "Admin",
    phone: "+966 500 123 456",
    location: "Makkah, Saudi Arabia",
    notes:
      "Leads the moderation team. Keep him in the weekly analytics reports.",
    isActive: true,
    createdAt: "2024-05-20T08:10:00Z",
    updatedAt: "2025-11-01T10:24:00Z",
    lastLogin: "2025-11-07T18:32:00Z",
    activity: [
      {
        id: "a1",
        title: "Approved a new reciter submission",
        subtitle: "3 days ago · From desktop",
        tone: "positive",
      },
      {
        id: "a2",
        title: "Updated translation content",
        subtitle: "6 days ago · Surah Al-Baqarah",
        tone: "neutral",
      },
      {
        id: "a3",
        title: "Reset password for an editor",
        subtitle: "1 week ago",
        tone: "warning",
      },
    ],
  },
  {
    id: 2,
    name: "Fatima Zahra",
    email: "fatima@example.com",
    role: "Editor",
    phone: "+971 50 765 4321",
    location: "Dubai, UAE",
    notes: "Focuses on audio library quality checks.",
    isActive: true,
    createdAt: "2024-02-15T09:00:00Z",
    updatedAt: "2025-10-21T14:05:00Z",
    lastLogin: "2025-11-06T09:14:00Z",
    activity: [
      {
        id: "b1",
        title: "Flagged audio inconsistencies",
        subtitle: "Yesterday · Needs follow-up",
        tone: "warning",
      },
      {
        id: "b2",
        title: "Uploaded 12 verified recitations",
        subtitle: "4 days ago",
        tone: "positive",
      },
    ],
  },
  {
    id: 3,
    name: "Bilal Hassan",
    email: "bilal@example.com",
    role: "Moderator",
    phone: "+60 12 345 6789",
    location: "Kuala Lumpur, Malaysia",
    notes: "",
    isActive: false,
    createdAt: "2023-11-02T11:40:00Z",
    updatedAt: "2025-09-18T07:48:00Z",
    lastLogin: "2025-08-30T15:05:00Z",
    activity: [
      {
        id: "c1",
        title: "Suspended for inactivity",
        subtitle: "2 months ago",
        tone: "neutral",
      },
    ],
  },
];

const route = useRoute();

const loading = ref(false);
const notFound = ref(false);
const successMessage = ref("");
const errors = ref<FormErrors>({});

const form = ref<UserForm>({
  name: "",
  email: "",
  role: undefined,
  phone: "",
  location: "",
  notes: "",
  isActive: true,
});

const originalForm = ref<UserForm | null>(null);
const activity = ref<ActivityItem[]>([]);
const lastSavedAt = ref<Date | null>(null);
const lastLogin = ref<Date | null>(null);
const createdAt = ref<Date | null>(null);

const initials = computed(() => {
  if (!form.value.name) return "U";
  return form.value.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
});

const statusDescription = computed(() =>
  form.value.isActive
    ? "Active users can log in and manage their assigned responsibilities."
    : "Inactive users cannot access the dashboard until reactivated."
);

const statusBadgeClass = computed(() =>
  form.value.isActive
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

function loadUser() {
  const idParam = Number(route.params.id);
  if (Number.isNaN(idParam)) {
    notFound.value = true;
    return;
  }

  const user = MOCK_USERS.find((item) => item.id === idParam);
  if (!user) {
    notFound.value = true;
    return;
  }

  notFound.value = false;
  const userForm: UserForm = {
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone ?? "",
    location: user.location ?? "",
    notes: user.notes ?? "",
    isActive: user.isActive,
  };

  form.value = { ...userForm };
  originalForm.value = { ...userForm };
  activity.value = user.activity ?? [];
  lastSavedAt.value = user.updatedAt ? new Date(user.updatedAt) : null;
  lastLogin.value = user.lastLogin ? new Date(user.lastLogin) : null;
  createdAt.value = user.createdAt ? new Date(user.createdAt) : null;
  successMessage.value = "";
  errors.value = {};
}

function validateForm(): boolean {
  const nextErrors: FormErrors = {};

  if (!form.value.name.trim()) {
    nextErrors.name = "Name is required.";
  }

  if (!form.value.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!isValidEmail(form.value.email)) {
    nextErrors.email = "Please enter a valid email address.";
  }

  if (!form.value.role) {
    nextErrors.role = "Select a role for this user.";
  }

  if (form.value.phone.trim()) {
    const phone = form.value.phone.trim();
    if (!/^\+?[\d\s-]{7,20}$/.test(phone)) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
  }

  if (form.value.notes && form.value.notes.length > 280) {
    nextErrors.notes = "Notes should be under 280 characters.";
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  successMessage.value = "";

  setTimeout(() => {
    loading.value = false;
    lastSavedAt.value = new Date();
    successMessage.value = "User details have been updated successfully.";
    if (originalForm.value) {
      originalForm.value = { ...form.value };
    }
  }, 900);
}

function resetForm() {
  if (!originalForm.value) return;
  form.value = { ...originalForm.value };
  errors.value = {};
}

function toggleStatus() {
  form.value.isActive = !form.value.isActive;
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
