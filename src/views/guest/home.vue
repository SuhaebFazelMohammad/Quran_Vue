<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const isAuthenticated = computed(() => userStore.isAuthenticated);
const isAdmin = computed(() => userStore.hasRole(1));

async function logout() {
  await userStore.logout();
  router.replace({ name: "login" });
}
</script>

<template>
  <main class="p-6 space-y-4">
    <header class="flex items-center gap-3">
      <h1 class="text-2xl font-semibold text-slate-800">Home</h1>
      <button
        v-if="isAuthenticated && !isAdmin"
        @click="logout"
        class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        Logout
      </button>
      <RouterLink
        v-if="!isAuthenticated"
        to="/login"
        class="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
      >
        Login
      </RouterLink>
    </header>

    <p v-if="isAuthenticated && !isAdmin" class="text-slate-600">
      Your account is authenticated but does not have permission to access the
      admin dashboard. Please contact an administrator if you believe this is a
      mistake.
    </p>

    <p v-else class="text-slate-600">
      Welcome to the Quran platform. Please sign in to continue to your
      dashboard.
    </p>
  </main>
</template>
