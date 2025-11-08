<template>
  <aside
    class="h-[calc(100dvh-3.5rem)] bg-white border-r border-amber-200 backdrop-blur-sm text-slate-800 flex flex-col fixed left-0 top-14 transition-all duration-300"
    :class="isSidebarOpen ? 'w-64' : 'w-20'"
  >
    <nav class="p-3 space-y-1 text-sm">
      <RouterLink
        to="/dashboard"
        :class="[
          'flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/dashboard')
            ? 'bg-amber-50 text-amber-700'
            : 'text-slate-600',
        ]"
      >
        <Icon icon="heroicons:home-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/users"
        :class="[
          'flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 transition-all duration-200',
          isSidebarOpen ? 'justify-start' : 'justify-center',
          isActive('/users') ? 'bg-amber-50 text-amber-700' : 'text-slate-600',
        ]"
      >
        <Icon icon="heroicons:users-20-solid" class="w-4 h-4" />
        <span v-if="isSidebarOpen">Users</span>
      </RouterLink>
    </nav>

    <div class="mt-auto p-3 border-t border-slate-200">
      <button
        type="button"
        class="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50"
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
