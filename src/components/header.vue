<template>
  <header
    class="h-14 border-b border-amber-200 bg-white/80 backdrop-blur flex items-center justify-between gap-x-5 px-4 fixed top-0 left-0 w-full z-10 transition-all duration-300"
  >
    <div class="h-14 flex items-center px-4 border-b border-b-amber-200">
      <div
        class="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-yellow-400 grid place-items-center font-bold text-amber-900 shadow-lg shadow-amber-400/30"
      >
        Q
      </div>
      <span class="ml-2 font-semibold">Quran Admin</span>
    </div>
    <div>
      <button
        type="button"
        class="rounded-lg px-2 py-1 bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <Icon icon="heroicons:bars-3-20-solid" class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSidebarStore } from "../stores/sidebar";

const sidebarStore = useSidebarStore();

function toggleSidebar() {
  sidebarStore.toggle();
}
</script>
