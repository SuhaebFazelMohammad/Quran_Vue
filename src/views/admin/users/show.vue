<template>
  <div class="space-y-6">
    <Heading title="User Overview" link="/admin/users" buttonText="Back" />

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

    <div
      v-else-if="user"
      class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <section class="space-y-6">
        <div class="surface-card">
          <div class="flex flex-wrap items-start gap-4">
            <div class="flex items-center gap-4">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-xl font-semibold text-amber-700 overflow-hidden ring-2 ring-amber-200 dark:ring-amber-400/30"
              >
                <img
                  v-if="userImageUrl && !showInitials"
                  :src="userImageUrl"
                  :alt="user.name"
                  class="h-full w-full object-cover"
                  @error="handleImageError"
                />
                <span v-else>{{ initials }}</span>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-slate-800">
                  {{ user.name }}
                </h2>
                <p class="text-sm text-slate-500">
                  {{ user.role }} · {{ user.location || "Location not set" }}
                </p>
              </div>
            </div>

            <div class="ml-auto flex flex-wrap items-center gap-2">
              <span
                :class="[
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                  statusBadgeClass,
                ]"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="user.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
                ></span>
                {{ user.isActive ? "Active" : "Inactive" }}
              </span>
              <span
                class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                <Icon icon="heroicons:clock-20-solid" class="h-4 w-4" />
                Last login {{ formattedLastLogin }}
              </span>
            </div>

            <RouterLink
              :to="`/admin/users/${user.id}/edit`"
              class="ml-auto inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
            >
              <Icon icon="heroicons:pencil-square-20-solid" class="h-4 w-4" />
              Edit user
            </RouterLink>
          </div>

          <p class="mt-4 text-sm text-slate-600">{{ statusDescription }}</p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="stat in statCards" :key="stat.id" class="surface-panel">
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-medium uppercase tracking-wide text-slate-400"
                  >{{ stat.label }}</span
                >
                <Icon :icon="stat.icon" class="h-5 w-5 text-amber-500" />
              </div>
              <p class="mt-2 text-2xl font-semibold text-slate-800">
                {{ stat.value }}
              </p>
              <p class="mt-1 text-xs text-slate-500">{{ stat.hint }}</p>
            </div>
          </div>
        </div>

        <div class="surface-card">
          <h3 class="text-sm font-semibold text-slate-700">Contact</h3>
          <div class="mt-4 space-y-4">
            <div
              v-for="detail in contactDetails"
              :key="detail.label"
              class="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 text-sm transition dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <div class="flex items-center gap-3 text-slate-500">
                <Icon :icon="detail.icon" class="h-5 w-5 text-amber-500" />
                <span class="font-medium text-slate-600">{{
                  detail.label
                }}</span>
              </div>
              <span class="text-right text-slate-700">
                {{ detail.value }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="surface-card">
          <h3 class="text-sm font-semibold text-slate-700">Account timeline</h3>
          <dl class="mt-4 space-y-3 text-sm text-slate-600">
            <div
              class="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 transition dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <dt class="flex items-center gap-2 text-slate-500">
                <Icon
                  icon="heroicons:calendar-days-20-solid"
                  class="h-5 w-5 text-amber-500"
                />
                Created
              </dt>
              <dd class="font-medium text-slate-700">
                {{ formattedCreatedAt }}
              </dd>
            </div>
            <div
              class="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 transition dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <dt class="flex items-center gap-2 text-slate-500">
                <Icon
                  icon="heroicons:document-text-20-solid"
                  class="h-5 w-5 text-sky-500"
                />
                Last updated
              </dt>
              <dd class="font-medium text-slate-700">
                {{ formattedUpdatedAt }}
              </dd>
            </div>
            <div
              class="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 transition dark:border-slate-800/70 dark:bg-slate-900/50"
            >
              <dt class="flex items-center gap-2 text-slate-500">
                <Icon
                  icon="heroicons:trash-20-solid"
                  class="h-5 w-5 text-red-500"
                />
                Deleted
              </dt>
              <dd
                class="text-xs font-medium"
                :class="
                  isDeleted
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                "
              >
                {{ isDeleted ? "Soft deleted" : "Active" }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="surface-card">
          <h3 class="text-sm font-semibold text-slate-700">Address</h3>
          <div
            class="mt-3 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
          >
            <Icon
              icon="heroicons:home-modern-20-solid"
              class="h-5 w-5 text-amber-500"
            />
            <p class="whitespace-pre-line leading-relaxed">
              {{ user.address || "Not specified" }}
            </p>
          </div>
        </div>

        <div
          class="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-6 shadow-lg shadow-amber-500/10 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100"
        >
          <div class="flex items-center gap-3">
            <Icon
              icon="heroicons:light-bulb-20-solid"
              class="h-6 w-6 text-amber-500"
            />
            <div>
              <p class="text-sm font-semibold text-amber-700">
                Next suggested step
              </p>
              <p class="mt-1 text-xs text-amber-700/80">
                Consider scheduling a check-in to review progress on current
                focus areas.
              </p>
            </div>
          </div>
          <RouterLink
            :to="`/admin/users/${user.id}/edit`"
            class="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 dark:border-amber-400/50 dark:bg-slate-900/40 dark:text-amber-200 dark:hover:bg-amber-400/10"
          >
            <Icon icon="heroicons:calendar-20-solid" class="h-4 w-4" />
            Schedule follow-up
          </RouterLink>
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
import { getUser, type User } from "../../../api/users";

interface StatCard {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: string;
}

interface UserOverview {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
  listeningFrom?: string | null;
  image?: number | string | null;
  sittingId?: number | null;
  deletedAt?: string | null;
  isActive: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  stats?: StatCard[];
}

const roleLabelById: Record<string, string> = {
  "1": "Admin",
  "2": "Moderator",
  "3": "User",
};

const genderLabelById: Record<string, string> = {
  "1": "Male",
  "2": "Female",
};

const route = useRoute();

const loading = ref(true);
const notFound = ref(false);
const user = ref<UserOverview | null>(null);
const stats = ref<StatCard[]>([]);
const showInitials = ref(false);

watch(
  () => route.params.id,
  () => {
    loadUser();
  },
  { immediate: true }
);

const initials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
});

const statusDescription = computed(() => {
  if (!user.value) {
    return "";
  }
  return user.value.isActive
    ? "This user currently has full access to the dashboard and their assigned responsibilities."
    : "This user cannot access the dashboard until their account is reactivated.";
});

const statusBadgeClass = computed(() => {
  if (!user.value) {
    return "border-slate-200 bg-slate-100 text-slate-500";
  }
  return user.value.isActive
    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
    : "border-slate-200 bg-slate-100 text-slate-500";
});

const statCards = computed(() => stats.value);

const contactDetails = computed(() => {
  if (!user.value) return [];
  return [
    {
      label: "Email",
      value: user.value.email || "Not provided",
      icon: "heroicons:envelope-open-20-solid",
    },
    {
      label: "Location",
      value: user.value.location || "Not specified",
      icon: "heroicons:map-pin-20-solid",
    },
    {
      label: "Phone",
      value: user.value.phone || "Not provided",
      icon: "heroicons:phone-20-solid",
    },
    {
      label: "Gender",
      value: user.value.gender ?? "Not specified",
      icon: "heroicons:user-20-solid",
    },
    {
      label: "Date of birth",
      value: user.value.dateOfBirth || "Not specified",
      icon: "heroicons:cake-20-solid",
    },
    {
      label: "Listening from",
      value: user.value.listeningFrom || "Not specified",
      icon: "heroicons:ear-20-solid",
    },
    {
      label: "Role",
      value: user.value.role,
      icon: "heroicons:shield-check-20-solid",
    },
  ];
});

const isDeleted = computed(() => Boolean(user.value?.deletedAt));

const formattedLastLogin = computed(() =>
  formatDateFromISO(user.value?.lastLogin)
);
const formattedCreatedAt = computed(() =>
  formatDateFromISO(user.value?.createdAt)
);
const formattedUpdatedAt = computed(() =>
  formatDateFromISO(user.value?.updatedAt)
);

const userImageUrl = computed(() => {
  if (!user.value?.image) {
    showInitials.value = true;
    return null;
  }

  // Reset showInitials when we have an image
  showInitials.value = false;

  // If image is a string (URL or path)
  if (typeof user.value.image === "string") {
    // If empty string, show initials
    if (!user.value.image.trim()) {
      showInitials.value = true;
      return null;
    }
    // If it's already a full URL (starts with http:// or https://), use it directly
    if (
      user.value.image.startsWith("http://") ||
      user.value.image.startsWith("https://")
    ) {
      return user.value.image;
    }
    // If it's a relative path, prepend API URL
    const apiUrl = import.meta.env.VITE_API_URL || "";
    // Remove trailing slash from API URL if present
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    // Remove leading slash from image path if present
    const imagePath = user.value.image.startsWith("/")
      ? user.value.image
      : `/${user.value.image}`;
    return `${baseUrl}${imagePath}`;
  }

  // If image is a number (ID), construct storage URL
  if (typeof user.value.image === "number") {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    return `${baseUrl}/storage/${user.value.image}`;
  }

  showInitials.value = true;
  return null;
});

function handleImageError() {
  // If image fails to load, show initials instead
  showInitials.value = true;
}

async function loadUser() {
  const idParam = Number(route.params.id);
  if (Number.isNaN(idParam)) {
    user.value = null;
    stats.value = [];
    notFound.value = true;
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    showInitials.value = false; // Reset initials flag when loading new user
    const backendUser: User = await getUser(idParam);

    const name =
      [backendUser.first_name, backendUser.last_name]
        .filter(Boolean)
        .join(" ") || backendUser.email;

    const rawRole: string | number | undefined =
      (backendUser as any).role_id ?? backendUser.role;
    const roleId = rawRole != null ? String(rawRole) : "3";
    const role = roleLabelById[roleId] ?? "User";

    const genderCode = backendUser.gender ?? undefined;
    const genderLabel =
      genderCode != null && genderLabelById[String(genderCode)]
        ? genderLabelById[String(genderCode)]
        : genderCode ?? undefined;

    const overview: UserOverview = {
      id: backendUser.id,
      name,
      email: backendUser.email,
      role,
      phone: backendUser.phone_num ?? "",
      location: backendUser.city ?? "",
      gender: genderLabel,
      address: backendUser.address,
      dateOfBirth: backendUser.date_of_birth ?? undefined,
      listeningFrom: backendUser.listening_from ?? null,
      image: backendUser.image ?? null,
      sittingId: backendUser.sitting_id ?? null,
      deletedAt: backendUser.softDelete ?? null,
      isActive: !backendUser.softDelete,
      notes: (backendUser as any).notes ?? "",
      createdAt: backendUser.created_at ?? undefined,
      updatedAt: backendUser.updated_at ?? undefined,
      lastLogin: (backendUser as any).last_login,
      stats: [],
    };

    notFound.value = false;
    user.value = overview;
    stats.value = overview.stats ?? [];
  } catch (error) {
    console.error("Failed to load user", error);
    user.value = null;
    stats.value = [];
    notFound.value = true;
  } finally {
    loading.value = false;
  }
}

function formatDateFromISO(iso?: string) {
  if (!iso) return "Not recorded";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// no-op
</script>

<style scoped></style>
