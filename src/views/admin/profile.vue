<template>
  <div class="space-y-6">
    <Heading title="Student Profile" link="/dashboard" buttonText="Back" />

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section class="surface-card space-y-6">
        <header class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Student ID</p>
            <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">{{ profile.id }}</h1>
          </div>

          <span
            class="surface-pill inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold"
            :class="statusBadgeClass"
          >
            <Icon :icon="statusIcon" class="h-4 w-4" />
            {{ profile.status }}
          </span>
        </header>

        <div
          class="surface-panel flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-xl font-semibold text-white shadow-lg shadow-amber-500/20 dark:from-amber-500 dark:to-amber-400"
          >
            {{ initials }}
          </div>
          <div class="space-y-1">
            <p class="text-lg font-semibold text-slate-900 dark:text-white">{{ profile.name }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ profile.program }}</p>
          </div>
          <span
            class="surface-pill ml-auto inline-flex items-center gap-2 text-xs font-medium"
          >
            <Icon icon="heroicons:calendar-days-20-solid" class="h-4 w-4 text-amber-500 dark:text-amber-300" />
            Enrolled {{ profile.enrollmentYear }}
          </span>
        </div>

        <dl class="grid gap-4 sm:grid-cols-2">
          <div class="surface-panel space-y-1">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Email</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">{{ profile.email }}</dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Advisor</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">{{ profile.advisor }}</dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Completed credits</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-100">{{ profile.credits }} / 128</dd>
          </div>
          <div class="surface-panel space-y-1">
            <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Cumulative GPA</dt>
            <dd class="mt-1 flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-300">
              {{ profile.gpa.toFixed(2) }}
              <span class="text-xs font-medium text-slate-400 dark:text-slate-500">Target ≥ 3.5</span>
            </dd>
          </div>
        </dl>

        <section class="space-y-3">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">About this student</h2>
          <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {{ profile.about }}
          </p>
        </section>

        <section class="space-y-3">
          <h2 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent achievements</h2>
          <ul class="space-y-2">
            <li
              v-for="achievement in profile.achievements"
              :key="achievement.id"
              class="surface-panel flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
            >
              <Icon :icon="achievement.icon" class="mt-1 h-4 w-4 text-amber-500 dark:text-amber-300" />
              <div>
                <p class="font-medium text-slate-700 dark:text-slate-100">{{ achievement.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ achievement.date }}</p>
              </div>
            </li>
          </ul>
        </section>
      </section>

      <section class="surface-card space-y-6">
        <header class="space-y-1">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Update student profile</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Edit core details and keep the academic record up to date.
          </p>
        </header>

        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <Text
            id="student-name"
            v-model="form.name"
            label="Full name"
            placeholder="Enter full name"
            icon-left="heroicons:user-circle-20-solid"
            :error="errors.name"
            clearable
            required
          />

          <Text
            id="student-email"
            v-model="form.email"
            label="Email address"
            type="email"
            placeholder="Enter email address"
            icon-left="heroicons:envelope-open-20-solid"
            :error="errors.email"
            hint="We will use this for official communication"
            clearable
            autocomplete="email"
          />

          <Select
            id="student-program"
            v-model="form.program"
            label="Program"
            :options="programOptions"
            placeholder="Select academic program"
            :clearable="false"
            :searchable="false"
            :error="errors.program"
          />

          <div class="grid gap-4 sm:grid-cols-2">
            <Text
              id="student-advisor"
              v-model="form.advisor"
              label="Academic advisor"
              placeholder="Advisor full name"
              icon-left="heroicons:briefcase-20-solid"
              :error="errors.advisor"
              clearable
            />

            <Text
              id="student-gpa"
              v-model="form.gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              label="Current GPA"
              placeholder="0.00"
              icon-left="heroicons:chart-bar-20-solid"
              :error="errors.gpa"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <Text
              id="student-credits"
              v-model="form.credits"
              type="number"
              min="0"
              max="128"
              label="Credits completed"
              placeholder="0"
              icon-left="heroicons:academic-cap-20-solid"
              :error="errors.credits"
            />

            <Select
              id="student-status"
              v-model="form.status"
              label="Enrollment status"
              :options="statusOptions"
              placeholder="Select status"
              :clearable="false"
              :searchable="false"
              :error="errors.status"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="student-about" class="text-sm font-medium text-slate-700">
              About
            </label>
            <textarea
              id="student-about"
              v-model="form.about"
              rows="5"
              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="Add a short summary of the student's goals, strengths, or interests..."
              maxlength="400"
            ></textarea>
            <div class="text-xs">
              <p v-if="errors.about" class="text-red-600 dark:text-red-400">{{ errors.about }}</p>
              <p v-else class="text-slate-500 dark:text-slate-400">{{ form.about.length }}/400 characters</p>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200"
          >
            <Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-5 w-5" />
            <div>
              <p class="font-medium">Saved</p>
              <p class="text-xs text-emerald-600/80">{{ successMessage }}</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              :disabled="loading || !isDirty"
              class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span
                v-if="loading"
                class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
              ></span>
              <span v-else>Save changes</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
              :disabled="!isDirty || loading"
              @click="resetForm"
            >
              <Icon icon="heroicons:arrow-path-20-solid" class="h-4 w-4" />
              Reset
            </button>

            <span class="ml-auto text-xs text-slate-500 dark:text-slate-400">
              Last updated {{ formattedUpdatedAt }}
            </span>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import Heading from "../../components/heading.vue";
import Select, { type SelectOption } from "../../components/input/select.vue";
import Text from "../../components/input/text.vue";

interface Achievement {
  id: string;
  title: string;
  date: string;
  icon: string;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  program: string;
  status: "Active" | "Leave" | "Graduated" | "Probation";
  gpa: number;
  credits: number;
  advisor: string;
  enrollmentYear: number;
  about: string;
  achievements: Achievement[];
  updatedAt: string;
}

type ProfileForm = {
  name: string;
  email: string;
  program: string | undefined;
  advisor: string;
  gpa: string;
  credits: string;
  status: StudentProfile["status"] | undefined;
  about: string;
};

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

const programOptions: SelectOption<string>[] = [
  { value: "Quranic Studies", label: "Quranic Studies" },
  { value: "Arabic Language & Linguistics", label: "Arabic Language & Linguistics" },
  { value: "Islamic History & Civilization", label: "Islamic History & Civilization" },
  { value: "Islamic Education", label: "Islamic Education" },
  { value: "Hadith Sciences", label: "Hadith Sciences" },
];

const statusOptions: SelectOption<StudentProfile["status"]>[] = [
  { value: "Active", label: "Active" },
  { value: "Leave", label: "On Leave" },
  { value: "Probation", label: "Probation" },
  { value: "Graduated", label: "Graduated" },
];

const profile = ref<StudentProfile>({
  id: "STU-2045",
  name: "Fatima Noor",
  email: "fatima.noor@example.edu",
  program: "Quranic Studies",
  status: "Active",
  gpa: 3.92,
  credits: 86,
  advisor: "Dr. Abdul Rahman",
  enrollmentYear: 2023,
  about:
    "Focused on advanced tajweed methodology with an emphasis on modern pedagogical approaches. Currently leading a student circle that produces weekly tafsir reflections in both Arabic and English.",
  achievements: [
    {
      id: "a1",
      title: "Presented at International Quranic Pedagogy Symposium",
      date: "Safar 1447 · Aug 2025",
      icon: "heroicons:microphone-20-solid",
    },
    {
      id: "a2",
      title: "Published paper on digital tajweed aids",
      date: "Dhul Hijjah 1446 · Jun 2025",
      icon: "heroicons:newspaper-20-solid",
    },
    {
      id: "a3",
      title: "Awarded top GPA in cohort",
      date: "Ramadan 1446 · Mar 2025",
      icon: "heroicons:academic-cap-20-solid",
    },
  ],
  updatedAt: "2025-11-05T09:12:00Z",
});

const form = ref<ProfileForm>({
  name: profile.value.name,
  email: profile.value.email,
  program: profile.value.program,
  advisor: profile.value.advisor,
  gpa: profile.value.gpa.toString(),
  credits: profile.value.credits.toString(),
  status: profile.value.status,
  about: profile.value.about,
});

const originalForm = ref<ProfileForm>({ ...form.value });
const loading = ref(false);
const successMessage = ref("");
const errors = ref<FormErrors>({});

const initials = computed(() =>
  profile.value.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()
);

const statusBadgeClass = computed(() => {
  switch (profile.value.status) {
    case "Active":
      return "border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/50 dark:bg-emerald-400/15 dark:text-emerald-200";
    case "Leave":
      return "border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-400/50 dark:bg-amber-400/15 dark:text-amber-200";
    case "Probation":
      return "border border-red-200 bg-red-50 text-red-600 dark:border-red-400/50 dark:bg-red-400/15 dark:text-red-200";
    case "Graduated":
      return "border border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-400/50 dark:bg-sky-400/15 dark:text-sky-200";
    default:
      return "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300";
  }
});

const statusIcon = computed(() => {
  switch (profile.value.status) {
    case "Active":
      return "heroicons:check-badge-20-solid";
    case "Leave":
      return "heroicons:moon-20-solid";
    case "Probation":
      return "heroicons:exclamation-triangle-20-solid";
    case "Graduated":
      return "heroicons:sparkles-20-solid";
    default:
      return "heroicons:information-circle-20-solid";
  }
});

const isDirty = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(originalForm.value);
});

const formattedUpdatedAt = computed(() => formatDateFromISO(profile.value.updatedAt));

watch(
  form,
  () => {
    if (successMessage.value) {
      successMessage.value = "";
    }
  },
  { deep: true }
);

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  successMessage.value = "";

  setTimeout(() => {
    const updatedProfile: StudentProfile = {
      ...profile.value,
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      program: form.value.program ?? profile.value.program,
      advisor: form.value.advisor.trim(),
      gpa: Number(form.value.gpa) || profile.value.gpa,
      credits: Number(form.value.credits) || profile.value.credits,
      status: form.value.status ?? profile.value.status,
      about: form.value.about.trim(),
      updatedAt: new Date().toISOString(),
    };

    profile.value = updatedProfile;
    originalForm.value = { ...form.value };
    successMessage.value = "Profile information has been updated.";
    loading.value = false;
  }, 900);
}

function resetForm() {
  form.value = { ...originalForm.value };
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
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.value.program) {
    nextErrors.program = "Select a program.";
  }

  if (!form.value.advisor.trim()) {
    nextErrors.advisor = "Advisor name is required.";
  }

  if (form.value.gpa.trim()) {
    const gpaValue = Number(form.value.gpa);
    if (Number.isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4) {
      nextErrors.gpa = "GPA must be between 0.00 and 4.00.";
    }
  } else {
    nextErrors.gpa = "GPA is required.";
  }

  if (form.value.credits.trim()) {
    const creditsValue = Number(form.value.credits);
    if (Number.isNaN(creditsValue) || creditsValue < 0 || creditsValue > 128) {
      nextErrors.credits = "Credits must be between 0 and 128.";
    }
  } else {
    nextErrors.credits = "Credits are required.";
  }

  if (!form.value.status) {
    nextErrors.status = "Select enrollment status.";
  }

  if (form.value.about.trim().length > 400) {
    nextErrors.about = "About section should be under 400 characters.";
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatDateFromISO(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
</script>

