<template>
  <header
    class="h-14 border-b border-amber-200 bg-white/80 backdrop-blur flex items-center justify-between gap-x-5 px-10 fixed top-0 left-0 w-full z-10 transition-all duration-300"
  >
    <div class="h-14 flex items-center px-4 border-b border-b-amber-200">
      <div
        class="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-yellow-400 grid place-items-center font-bold text-amber-900 shadow-lg shadow-amber-400/30"
      >
        Q
      </div>
      <span class="ml-2 font-semibold">Quran Admin</span>
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
        class="rounded-lg px-2 py-1 bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px relative"
      >
        <Icon icon="heroicons:bell-alert-20-solid" class="w-5 h-5" />
        <span
          class="size-2 rounded-full bg-red-500 absolute top-1 right-2 animate-ping"
        ></span>
      </button>
      <button
        type="button"
        class="rounded-lg px-2 py-1 bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <Icon icon="heroicons:bars-3-20-solid" class="w-5 h-5" />
      </button>
      <button
        type="button"
        class="rounded-lg px-2 py-1 bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px"
        @click="themeStore.toggleTheme()"
        aria-label="Toggle theme"
      >
        <Icon icon="heroicons:moon-20-solid" class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";
import { useSidebarStore } from "../stores/sidebar";
import { useSearchStore } from "../stores/search";
import SearchInput from "./input/search.vue";
import { useThemeStore } from "../stores/darkMode";

const sidebarStore = useSidebarStore();
const searchStore = useSearchStore();
const themeStore = useThemeStore();


onMounted(() => {
  themeStore.initTheme()
})
const { query, placeholder, emptyText } = storeToRefs(searchStore);

const searchValue = computed({
  get: () => query.value,
  set: (value: string) => searchStore.setQuery(value),
});

function toggleSidebar() {
  sidebarStore.toggle();
}
</script>
