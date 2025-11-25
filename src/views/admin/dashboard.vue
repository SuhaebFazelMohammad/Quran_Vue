<script setup lang="ts">
import { computed, ref } from "vue"; 
import { Icon } from "@iconify/vue";


const quickStats = ref([
  {
    id: "listeners",
    label: "Daily listeners",
    value: "18,240",
    delta: "+12.4%",
    tone: "positive",
    icon: "heroicons:musical-note-20-solid",
  },
  {
    id: "sessions",
    label: "Active sessions",
    value: "4,892",
    delta: "+3.1%",
    tone: "neutral",
    icon: "heroicons:device-phone-mobile-20-solid",
  },
  {
    id: "completion",
    label: "Session completion",
    value: "86%",
    delta: "-1.5%",
    tone: "warning",
    icon: "heroicons:chart-pie-20-solid",
  },
]);

const trendingSurahs = ref([
  { name: "Al-Fatiha", reciter: "Mishary Al Afasy", growth: "+18%" },
  { name: "Al-Baqarah", reciter: "Saad Al-Ghamdi", growth: "+11%" },
  { name: "Yasin", reciter: "Maher Al Muaiqly", growth: "+9%" },
]);

const highlights = ref([
  {
    title: "New translation bundle",
    description: "15 languages refreshed for mobile listeners.",
    badge: "Released 2 days ago",
    icon: "heroicons:globe-alt-20-solid",
    toneClass:
      "from-sky-400/30 via-sky-400/10 to-transparent dark:from-sky-500/30 dark:via-sky-500/10",
  },
  {
    title: "Studio submissions",
    description: "7 new studio recitations awaiting moderation.",
    badge: "Pending review",
    icon: "heroicons:adjustments-horizontal-20-solid",
    toneClass:
      "from-amber-400/30 via-amber-400/10 to-transparent dark:from-amber-500/30 dark:via-amber-500/10",
  },
]);

const timeline = ref([
  {
    id: "t1",
    title: "Surah Al-Mulk remastered",
    subtitle: "Uploaded by Studio Jeddah",
    time: "1 hour ago",
    icon: "heroicons:cloud-arrow-up-20-solid",
  },
  {
    id: "t2",
    title: "User milestone reached",
    subtitle: "500k daily listeners worldwide",
    time: "3 hours ago",
    icon: "heroicons:star-20-solid",
  },
  {
    id: "t3",
    title: "Moderator feedback",
    subtitle: "3 pending issues for review",
    time: "Yesterday",
    icon: "heroicons:inbox-stack-20-solid",
  },
]);

const toneClasses = computed(() => (tone: string) => {
  switch (tone) {
    case "positive":
      return "text-emerald-500 dark:text-emerald-300";
    case "warning":
      return "text-amber-500 dark:text-amber-300";
    default:
      return "text-slate-500 dark:text-slate-300";
  }
});
</script>

<template>
  <div class="space-y-6">
    <section class="surface-card overflow-hidden">
      <div class="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <span class="surface-pill bg-white/80 dark:bg-slate-900/60">
            <Icon icon="heroicons:sparkles-20-solid" class="h-4 w-4 text-amber-500" />
            Welcome back
          </span>
          <h1 class="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
            Inspire millions with a serene listening journey
          </h1>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Track engagement, curate meaningful sessions, and keep the Quran platform
            vibrant for listeners across the globe. Your dashboard highlights the most
            impactful moments of today.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-medium shadow-amber-500/20"
            >
              View moderation queue
              <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4" />
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
            >
              Export analytics
            </button>
          </div>
        </div>
        <div
          class="relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-br from-amber-400/50 via-amber-500/30 to-amber-600/40 p-6 shadow-inner shadow-amber-500/30 dark:border-slate-800/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/80"
        >
          <div class="absolute inset-0 opacity-30 blur-3xl">
            <div class="h-full w-full bg-mesh-light dark:bg-mesh-dark"></div>
          </div>
          <div class="relative z-10 space-y-4">
            <h2 class="text-lg font-semibold text-white">Community focus</h2>
            <p class="text-sm text-white/80">
              “We just released a curated series of recitations from leading imams across
              Makkah and Madinah. Early feedback shows increased listener retention.”
            </p>
            <div class="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white">
              <Icon icon="heroicons:user-group-20-solid" class="h-4 w-4" />
              Moderation & Experience Team
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="stat in quickStats"
        :key="stat.id"
        class="surface-panel space-y-3"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            {{ stat.label }}
          </span>
          <Icon :icon="stat.icon" class="h-5 w-5 text-amber-500 dark:text-amber-300" />
        </div>
        <p class="text-2xl font-semibold text-slate-900 dark:text-white">
          {{ stat.value }}
        </p>
        <span class="text-xs" :class="toneClasses(stat.tone)">
          {{ stat.delta }}
        </span>
      </article>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div class="surface-card space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            Trending surahs
          </h2>
          <button
            type="button"
            class="inline-flex items-center gap-2 text-sm font-medium text-amber-600 transition hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
          >
            View library
            <Icon icon="heroicons:arrow-up-right-20-solid" class="h-4 w-4" />
          </button>
        </div>
        <ul class="space-y-3">
          <li
            v-for="item in trendingSurahs"
            :key="item.name"
            class="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 text-sm transition hover:border-amber-300 hover:bg-amber-50/40 dark:border-slate-800/70 dark:bg-slate-900/50 dark:hover:border-amber-400/60 dark:hover:bg-amber-400/10"
          >
            <div>
              <p class="font-medium text-slate-900 dark:text-white">
                {{ item.name }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ item.reciter }}
              </p>
            </div>
            <span class="text-xs font-medium text-emerald-500 dark:text-emerald-300">
              {{ item.growth }}
            </span>
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <article
          v-for="card in highlights"
          :key="card.title"
          class="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-lg shadow-amber-500/10 transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-900/60 dark:shadow-black/40"
        >
          <div
            class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br"
            :class="card.toneClass"
          ></div>
          <div class="flex items-start gap-3">
            <div
              class="inline-flex items-center justify-center rounded-xl bg-slate-900/10 p-2 text-amber-600 dark:bg-white/10 dark:text-amber-200"
            >
              <Icon :icon="card.icon" class="h-5 w-5" />
            </div>
            <div class="space-y-2">
              <h3 class="text-base font-semibold text-slate-900 dark:text-white">
                {{ card.title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ card.description }}
              </p>
              <span class="surface-pill text-amber-600 dark:text-amber-300">
                {{ card.badge }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="surface-card">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
          Platform timeline
        </h2>
        <button
          type="button"
          class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-amber-500 dark:text-slate-300 dark:hover:text-amber-300"
        >
          See all updates
          <Icon icon="heroicons:arrow-right-20-solid" class="h-4 w-4" />
        </button>
      </div>
      <ol class="mt-6 space-y-4">
        <li
          v-for="entry in timeline"
          :key="entry.id"
          class="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white/70 px-5 py-4 transition hover:border-amber-300 hover:bg-amber-50/30 dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-amber-400/60 dark:hover:bg-amber-400/10"
        >
          <span
            class="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:bg-amber-400/20 dark:text-amber-200"
          >
            <Icon :icon="entry.icon" class="h-5 w-5" />
          </span>
          <div>
            <p class="font-medium text-slate-900 dark:text-white">
              {{ entry.title }}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ entry.subtitle }}
            </p>
            <span class="mt-1 inline-block text-xs text-slate-400 dark:text-slate-500">
              {{ entry.time }}
            </span>
          </div>
        </li>
      </ol>
    </section>
  </div>
</template>