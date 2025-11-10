<template>
  <aside
    class="fixed left-0 top-16 flex h-[calc(100dvh-4rem)] flex-col border-r border-amber-200/50 bg-white/85 text-slate-800 shadow-lg shadow-amber-200/15 backdrop-blur-2xl transition-all duration-500 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-100"
    :class="isSidebarOpen ? 'w-64' : 'w-20'"
  >
    <nav class="p-4 space-y-1 text-sm">
      <RouterLink
        to="/dashboard"
        :class="[
          'flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/dashboard')
            ? 'bg-amber-500/15 text-amber-600 shadow-inner shadow-amber-500/20 dark:bg-amber-400/20 dark:text-amber-200'
            : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/70',
        ]"
      >
        <Icon icon="heroicons:home-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/users"
        :class="[
          'flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/users')
            ? 'bg-amber-500/15 text-amber-600 shadow-inner shadow-amber-500/20 dark:bg-amber-400/20 dark:text-amber-200'
            : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/70',
        ]"
      >
        <Icon icon="heroicons:users-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Users</span>
      </RouterLink>

      <RouterLink
        to="/course"
        :class="[
          'flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/course')
            ? 'bg-amber-500/15 text-amber-600 shadow-inner shadow-amber-500/20 dark:bg-amber-400/20 dark:text-amber-200'
            : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/70',
        ]"
      >
        <Icon icon="heroicons:book-open-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Course</span>
      </RouterLink>

      <RouterLink
        to="/course-type"
        :class="[
          'flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/course-type')
            ? 'bg-amber-500/15 text-amber-600 shadow-inner shadow-amber-500/20 dark:bg-amber-400/20 dark:text-amber-200'
            : 'text-slate-600 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:bg-slate-800/70',
        ]"
      >
        <Icon icon="heroicons:rectangle-stack-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Course Types</span>
      </RouterLink>
    </nav>

    <div class="mt-auto border-t border-slate-200/70 p-4 dark:border-slate-800/60">
      <button
        type="button"
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/70 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100/70 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/70"
        @click="logout"
      >
        <Icon
          icon="heroicons:arrow-left-on-rectangle-20-solid"
          class="w-4 h-4"
        />
        <span v-if="isSidebarOpen">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter, RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { useSidebarStore } from "../stores/sidebar";
import { computed } from "vue";

const sidebarStore = useSidebarStore();
const isSidebarOpen = computed(() => sidebarStore.isOpen);

const route = useRoute();
const router = useRouter();

function isActive(path: string) {
  return route.path === path;
}

function logout() {
  router.push("/login");
}
</script>
