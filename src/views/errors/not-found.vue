<template>
  <div class="flex h-full flex-col items-center justify-center gap-4 text-center">
    <h1 class="text-5xl font-bold text-amber-500">404</h1>
    <p class="max-w-md text-base text-slate-600 dark:text-slate-300">
      The page you’re looking for doesn’t exist or has been moved. Please check the URL or return to the dashboard.
    </p>
    <RouterLink
      to="/dashboard"
      class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-semibold shadow-amber-500/20"
    >
      Go to Dashboard
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>


