<template>
  <div class="space-y-6">
    <Heading title="User Overview" link="/users" buttonText="Back" />

    <div
      v-if="notFound"
      class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
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

    <div
      v-else-if="user"
      class="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <section class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex flex-wrap items-start gap-4">
            <div class="flex items-center gap-4">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-xl font-semibold text-amber-700"
              >
                {{ initials }}
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
              :to="`/users/${user.id}/edit`"
              class="ml-auto inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
            >
              <Icon icon="heroicons:pencil-square-20-solid" class="h-4 w-4" />
              Edit user
            </RouterLink>
          </div>

          <p class="mt-4 text-sm text-slate-600">{{ statusDescription }}</p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="stat in statCards"
              :key="stat.id"
              class="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
            >
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

        <div class="grid gap-6 lg:grid-cols-2">
          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 class="text-sm font-semibold text-slate-700">Contact</h3>
            <div class="mt-4 space-y-4">
              <div
                v-for="detail in contactDetails"
                :key="detail.label"
                class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm"
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

          <div
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 class="text-sm font-semibold text-slate-700">Teams & Focus</h3>
            <div class="mt-3">
              <p class="text-xs uppercase tracking-wide text-slate-400">
                Teams
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="team in teams"
                  :key="team"
                  class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  <Icon
                    icon="heroicons:user-group-20-solid"
                    class="h-4 w-4 text-slate-400"
                  />
                  {{ team }}
                </span>
                <span v-if="!teams.length" class="text-sm text-slate-500">
                  No teams assigned.
                </span>
              </div>
            </div>
            <div class="mt-5">
              <p class="text-xs uppercase tracking-wide text-slate-400">
                Focus areas
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="area in focusAreas"
                  :key="area"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600"
                >
                  <Icon
                    icon="heroicons:sparkles-20-solid"
                    class="h-4 w-4 text-emerald-500"
                  />
                  {{ area }}
                </span>
                <span v-if="!focusAreas.length" class="text-sm text-slate-500">
                  No focus areas recorded.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700">
              Permissions & Access
            </h3>
            <span class="text-xs text-slate-400"
              >Last updated {{ formattedUpdatedAt }}</span
            >
          </div>

          <ul class="mt-4 grid gap-3 sm:grid-cols-2">
            <li
              v-for="permission in permissions"
              :key="permission"
              class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm text-slate-600"
            >
              <Icon
                icon="heroicons:check-circle-20-solid"
                class="mt-0.5 h-5 w-5 text-emerald-500"
              />
              <span>{{ permission }}</span>
            </li>
            <li
              v-if="!permissions.length"
              class="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500"
            >
              No permissions configured.
            </li>
          </ul>

          <div
            v-if="hasNotes"
            class="mt-5 rounded-xl bg-slate-50/80 p-4 text-sm text-slate-600"
          >
            <p
              class="text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Internal notes
            </p>
            <p class="mt-2 leading-relaxed">
              {{ user.notes }}
            </p>
          </div>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-semibold text-slate-700">Account timeline</h3>
          <dl class="mt-4 space-y-3 text-sm text-slate-600">
            <div
              class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
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
              class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
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
              class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <dt class="flex items-center gap-2 text-slate-500">
                <Icon
                  icon="heroicons:device-phone-mobile-20-solid"
                  class="h-5 w-5 text-purple-500"
                />
                Preferred device
              </dt>
              <dd class="font-medium text-slate-700">
                {{ user.preferredDevice || "Unknown" }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700">
              Recent activity
            </h3>
            <span class="text-xs text-slate-400"
              >Last {{ activity.length }} events</span
            >
          </div>
          <ul class="mt-4 space-y-3">
            <li
              v-for="item in activity"
              :key="item.id"
              class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <span
                class="mt-1 h-2.5 w-2.5 rounded-full"
                :class="activityToneClass(item.tone)"
              ></span>
              <div>
                <p class="text-sm font-medium text-slate-700">
                  {{ item.title }}
                </p>
                <p class="text-xs text-slate-500">{{ item.subtitle }}</p>
              </div>
            </li>
            <li
              v-if="activity.length === 0"
              class="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500"
            >
              No recorded activity for this user yet.
            </li>
          </ul>
        </div>

        <div
          class="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm"
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
            :to="`/users/${user.id}/edit`"
            class="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-100"
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

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  tone?: "positive" | "neutral" | "warning";
}

interface StatCard {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: string;
}

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
  preferredDevice?: string;
  teams?: string[];
  focusAreas?: string[];
  permissions?: string[];
  stats?: StatCard[];
  activity?: ActivityItem[];
}

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: "Ali Kareem",
    email: "ali@example.com",
    role: "Admin",
    phone: "+966 500 123 456",
    location: "Makkah, Saudi Arabia",
    isActive: true,
    notes:
      "Leads the moderation team. Keep him in the weekly analytics reports.",
    createdAt: "2024-05-20T08:10:00Z",
    updatedAt: "2025-11-01T10:24:00Z",
    lastLogin: "2025-11-07T18:32:00Z",
    preferredDevice: "Desktop · Chrome",
    teams: ["Content Strategy", "Moderation"],
    focusAreas: ["Moderation workflow", "Analytics insights", "Team coaching"],
    permissions: [
      "Approve new reciters and content submissions",
      "Manage administrator accounts",
      "Access advanced analytics dashboards",
      "Configure platform-wide settings",
    ],
    stats: [
      {
        id: "approved",
        label: "Items approved",
        value: "128",
        hint: "+12 this month",
        icon: "heroicons:check-circle-20-solid",
      },
      {
        id: "reviews",
        label: "Reviews completed",
        value: "46",
        hint: "Avg. turnaround 4h",
        icon: "heroicons:clipboard-document-check-20-solid",
      },
      {
        id: "team",
        label: "Team members",
        value: "8",
        hint: "3 active moderators",
        icon: "heroicons:user-group-20-solid",
      },
    ],
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
    isActive: true,
    notes: "Focuses on audio library quality checks.",
    createdAt: "2024-02-15T09:00:00Z",
    updatedAt: "2025-10-21T14:05:00Z",
    lastLogin: "2025-11-06T09:14:00Z",
    preferredDevice: "iPad · Safari",
    teams: ["Audio Quality", "Content Review"],
    focusAreas: ["Audio verification", "Contributor onboarding"],
    permissions: [
      "Edit and publish audio content",
      "Manage contributor feedback",
      "Flag content for moderation review",
    ],
    stats: [
      {
        id: "uploads",
        label: "Uploads reviewed",
        value: "312",
        hint: "Top contributor this month",
        icon: "heroicons:arrow-up-tray-20-solid",
      },
      {
        id: "issues",
        label: "Issues flagged",
        value: "18",
        hint: "5 awaiting follow-up",
        icon: "heroicons:flag-20-solid",
      },
      {
        id: "rating",
        label: "Quality rating",
        value: "4.8",
        hint: "Based on team feedback",
        icon: "heroicons:sparkles-20-solid",
      },
    ],
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
    isActive: false,
    notes:
      "Currently on extended leave. Reactivate after confirming availability.",
    createdAt: "2023-11-02T11:40:00Z",
    updatedAt: "2025-09-18T07:48:00Z",
    lastLogin: "2025-08-30T15:05:00Z",
    preferredDevice: "Android · Chrome",
    teams: ["Community support"],
    focusAreas: ["User reports", "Compliance"],
    permissions: [
      "Moderate community reports",
      "Suspend user-generated content",
    ],
    stats: [
      {
        id: "reports",
        label: "Reports resolved",
        value: "89",
        hint: "Paused since Sep",
        icon: "heroicons:shield-check-20-solid",
      },
      {
        id: "response",
        label: "Avg. response",
        value: "2.5h",
        hint: "When active",
        icon: "heroicons:bolt-20-solid",
      },
      {
        id: "status",
        label: "Status",
        value: "Inactive",
        hint: "Requires reactivation",
        icon: "heroicons:pause-circle-20-solid",
      },
    ],
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

const notFound = ref(false);
const user = ref<MockUser | null>(null);
const activity = ref<ActivityItem[]>([]);
const stats = ref<StatCard[]>([]);

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
      label: "Phone",
      value: user.value.phone || "Not provided",
      icon: "heroicons:phone-20-solid",
    },
    {
      label: "Location",
      value: user.value.location || "Not specified",
      icon: "heroicons:map-pin-20-solid",
    },
    {
      label: "Role",
      value: user.value.role,
      icon: "heroicons:shield-check-20-solid",
    },
  ];
});

const teams = computed(() => user.value?.teams ?? []);
const focusAreas = computed(() => user.value?.focusAreas ?? []);
const permissions = computed(() => user.value?.permissions ?? []);
const hasNotes = computed(() => Boolean(user.value?.notes?.trim()));

const formattedLastLogin = computed(() =>
  formatDateFromISO(user.value?.lastLogin)
);
const formattedCreatedAt = computed(() =>
  formatDateFromISO(user.value?.createdAt)
);
const formattedUpdatedAt = computed(() =>
  formatDateFromISO(user.value?.updatedAt)
);

function loadUser() {
  const idParam = Number(route.params.id);
  if (Number.isNaN(idParam)) {
    user.value = null;
    stats.value = [];
    activity.value = [];
    notFound.value = true;
    return;
  }

  const found = MOCK_USERS.find((item) => item.id === idParam);
  if (!found) {
    user.value = null;
    stats.value = [];
    activity.value = [];
    notFound.value = true;
    return;
  }

  notFound.value = false;
  user.value = { ...found };
  stats.value = found.stats ? [...found.stats] : [];
  activity.value = found.activity ? [...found.activity] : [];
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
