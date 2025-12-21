<script setup lang="ts">
import AdminLayout from "./layouts/adminLayout.vue";
import AuthLayout from "./layouts/authLayout.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "./stores/userStore";
import { computed } from "vue";

const route = useRoute();
const userStore = useUserStore();

// Determine which layout to show based on route and authentication
const shouldShowAuthLayout = computed(() => {
  const routeName = route.name as string;
  const requiresAuth = route.meta?.requiresAuth === true;
  const isAuthenticated = userStore.isAuthenticated;

  // Always show auth layout for login and home pages
  if (routeName === "login" || routeName === "home") {
    return true;
  }

  // If route requires auth but user is not authenticated, show auth layout
  // (router guard will redirect, but this prevents layout flash)
  if (requiresAuth && !isAuthenticated) {
    return true;
  }

  if(routeName === "not-found" && !userStore.hasRole(1)) {
    return true;
  }
  if(routeName === "not-found" && userStore.hasRole(1)) {
    return false;
  }

  // Otherwise show admin layout
  return false;
});
</script>

<template>
  <AuthLayout v-if="shouldShowAuthLayout" />
  <AdminLayout v-else />
</template>
