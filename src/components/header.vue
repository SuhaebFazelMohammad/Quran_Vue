<template>
  <header
    class="fixed top-0 left-0 z-20 flex h-16 w-full items-center justify-between gap-x-5 border-b border-amber-200/50 bg-white/90 px-6 text-slate-900 shadow-md shadow-amber-200/20 backdrop-blur-xl transition-all duration-500 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-100 sm:px-10"
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
      <button
        type="button"
        class="relative inline-flex size-10 items-center justify-center rounded-xl border border-amber-200/60 bg-amber-500/90 text-white shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:translate-y-px dark:border-amber-300/40"
      >
        <Icon icon="heroicons:bell-alert-20-solid" class="w-5 h-5" />
        <span
          class="size-2 rounded-full bg-red-500 absolute top-1 right-2 animate-ping"
        ></span>
      </button>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-md shadow-amber-500/10 transition hover:border-amber-300 hover:text-amber-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
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
import { computed } from "vue";
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

function toggleSidebar() {
  sidebarStore.toggle();
}
</script>
