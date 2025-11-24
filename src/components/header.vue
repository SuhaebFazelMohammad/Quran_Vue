<template>
  <header
    class="fixed top-0 left-0 z-20 flex h-16 w-full items-center justify-between gap-x-5 border-b border-amber-200/60 bg-white/95 px-6 text-slate-900 shadow-lg shadow-amber-200/30 backdrop-blur-xl transition-all duration-500 dark:border-slate-800/60 dark:bg-gradient-to-r dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 dark:text-amber-50 dark:shadow-slate-950/60 sm:px-10"
  >
    <div class="flex h-16 items-center gap-x-4 px-4">
      <button
        type="button"
        class="glass-button bg-amber-500/90 px-3 py-2 hover:bg-amber-500"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <Icon icon="heroicons:bars-3-20-solid" class="w-5 h-5" />
      </button>
      <div class="flex items-center">
        <div
          class="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-yellow-400 grid place-items-center font-bold text-amber-900 shadow-lg shadow-amber-400/30"
        >
          Q
        </div>
        <span class="ml-2 font-semibold">Quran Admin</span>
      </div>
    </div>

    <div class="flex items-center gap-x-3">
      <SearchInput
        v-model="searchValue"
        :placeholder="placeholder"
        class="hidden sm:block w-56 md:w-72"
        :empty-text="emptyText"
      />
      <div class="relative" ref="notificationRef">
        <button
          type="button"
          class="relative inline-flex size-10 items-center justify-center rounded-xl border border-amber-200/60 bg-amber-500/90 text-white shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:translate-y-px dark:border-amber-300/60 dark:bg-amber-500/85"
          @click="toggleNotifications"
        >
          <Icon icon="heroicons:bell-alert-20-solid" class="w-5 h-5" />
          <span
            v-if="hasUnread"
            class="size-2 rounded-full bg-red-500 absolute top-1 right-2 animate-ping"
          ></span>
        </button>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="isNotificationOpen"
            class="absolute right-0 z-30 mt-3 w-80 overflow-hidden rounded-2xl border border-amber-200/70 bg-white/95 p-4 shadow-2xl shadow-amber-400/25 backdrop-blur-lg dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-slate-950"
          >
            <div class="flex items-center justify-between">
              <h3
                class="text-sm font-semibold text-slate-800 dark:text-amber-100"
              >
                Notifications
              </h3>
              <span
                class="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-400/25 dark:text-amber-100"
              >
                {{ notifications.length }}
              </span>
            </div>
            <div class="mt-3 space-y-3">
              <div
                v-if="!notifications.length"
                class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-amber-200/60 bg-amber-50/40 p-6 text-center text-sm text-slate-500 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-300"
              >
                <Icon
                  icon="heroicons:bell-slash-20-solid"
                  class="h-6 w-6 text-amber-400"
                />
                <span>No new notifications</span>
              </div>
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="group relative overflow-hidden rounded-xl border border-amber-200/60 bg-gradient-to-br from-white via-white/80 to-amber-50/40 p-3 shadow-md shadow-amber-100/40 transition hover:-translate-y-0.5 hover:shadow-amber-200/55 dark:border-slate-800/60 dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950/90 dark:shadow-slate-950/60 dark:hover:border-amber-400/40"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="rounded-full bg-amber-500/15 p-2 text-amber-600 dark:bg-amber-400/25 dark:text-amber-100"
                  >
                    <Icon :icon="notification.icon" class="h-5 w-5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p
                      class="truncate text-sm font-semibold text-slate-700 dark:text-amber-50"
                    >
                      {{ notification.title }}
                    </p>
                    <p
                      class="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-300"
                    >
                      {{ notification.description }}
                    </p>
                    <span
                      class="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 dark:text-amber-300"
                    >
                      <Icon
                        icon="heroicons:clock-20-solid"
                        class="h-3.5 w-3.5"
                      />
                      {{ notification.timeAgo }}
                    </span>
                  </div>
                </div>
                <span
                  v-if="notification.unread"
                  class="absolute top-3 right-3 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
                >
                  New
                </span>
              </div>
            </div>
            <button
              v-if="notifications.length"
              type="button"
              class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-400/40 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400"
              @click="markAllAsRead"
            >
              <Icon icon="heroicons:check-badge-20-solid" class="h-5 w-5" />
              Mark all as read
            </button>
          </div>
        </transition>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-md shadow-amber-500/10 transition hover:border-amber-300 hover:text-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 dark:border-slate-800/60 dark:bg-gradient-to-r dark:from-slate-950/80 dark:via-slate-900/70 dark:to-slate-950/80 dark:text-amber-100 dark:hover:border-amber-400 dark:hover:text-amber-200"
        @click="theme.toggleTheme()"
        aria-label="Toggle theme"
      >
        <Icon :icon="themeIcon" class="w-5 h-5" />
        <span class="hidden md:inline">{{ themeLabel }}</span>
      </button>
      <RouterLink
        to="/users/profile"
        class="glass-button bg-amber-500/95 px-3 py-2"
      >
        <Icon icon="heroicons:user-20-solid" class="w-5 h-5" />
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";
import { useSidebarStore } from "../stores/sidebar";
import { useSearchStore } from "../stores/search";
import SearchInput from "./input/search.vue";
import { useThemeStore } from "../stores/darkMode";

const sidebarStore = useSidebarStore();
const searchStore = useSearchStore();
const theme = useThemeStore();

const { query, placeholder, emptyText } = storeToRefs(searchStore);
const { isDark } = storeToRefs(theme);

const searchValue = computed({
  get: () => query.value,
  set: (value: string) => searchStore.setQuery(value),
});

const themeIcon = computed(() =>
  isDark.value ? "heroicons:sun-20-solid" : "heroicons:moon-20-solid"
);
const themeLabel = computed(() => (isDark.value ? "Light mode" : "Dark mode"));

const isNotificationOpen = ref(false);
const notifications = ref([
  {
    id: 1,
    title: "New student enrolled",
    description: "Fatima joined the Tajweed Foundations course.",
    timeAgo: "5 mins ago",
    unread: true,
    icon: "heroicons:user-plus-20-solid",
  },
  {
    id: 2,
    title: "Feedback received",
    description: "A new testimonial has been submitted for Course Types.",
    timeAgo: "2 hours ago",
    unread: true,
    icon: "heroicons:chat-bubble-left-right-20-solid",
  },
  {
    id: 3,
    title: "Schedule updated",
    description: "Upcoming class schedule was updated by Admin Bilal.",
    timeAgo: "Yesterday",
    unread: false,
    icon: "heroicons:calendar-days-20-solid",
  },
]);

const hasUnread = computed(() => notifications.value.some((n) => n.unread));
const notificationRef = ref<HTMLElement | null>(null);

function toggleSidebar() {
  sidebarStore.toggle();
}

function toggleNotifications() {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (!isNotificationOpen.value) {
    markAllAsRead();
  }
}

function markAllAsRead() {
  notifications.value = notifications.value.map((notification) => ({
    ...notification,
    unread: false,
  }));
}

function handleClickOutside(event: MouseEvent) {
  if (!isNotificationOpen.value) return;
  const target = event.target as Node;
  if (notificationRef.value && !notificationRef.value.contains(target)) {
    isNotificationOpen.value = false;
    markAllAsRead();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
