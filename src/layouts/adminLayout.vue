<template>
  <div
    class="relative min-h-dvh overflow-hidden transition-colors duration-500"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    ></div> 

    <div class="relative min-h-dvh text-slate-900 dark:text-slate-100">
      <Sidebar />
      <AppHeader />
      <main
        class="flex-1 min-h-dvh px-6 pb-12 pt-24 transition-all duration-500"
        :class="isSidebarOpen ? 'ml-64' : 'ml-20'"
      >
        <section class="mt-2 w-full space-y-6">
          <router-view />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/sidebar.vue";
import { useSidebarStore } from "../stores/sidebar";
import { computed } from "vue";
import AppHeader from "../components/header.vue";

const sidebarStore = useSidebarStore();
const isSidebarOpen = computed(() => sidebarStore.isOpen);
</script>
