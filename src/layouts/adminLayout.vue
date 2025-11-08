<template>
  <div class="relative min-h-dvh bg-white text-slate-900">
    <div>
      <Sidebar />
      <AppHeader />
      <main
        class="flex-1 min-h-dvh transition-all duration-300"
        :class="isSidebarOpen == true ? 'ml-64' : 'ml-20'"
      >
        <section class="p-4 mt-14">
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
