<template>
  <div
    class="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 px-4 py-3 text-sm text-emerald-800 shadow-md shadow-emerald-200/70 dark:border-emerald-500/40 dark:bg-gradient-to-br dark:from-emerald-900/80 dark:via-emerald-900 dark:to-emerald-800/80 dark:text-emerald-100 dark:shadow-lg dark:shadow-emerald-900/60"
  >
    <Icon icon="heroicons:check-circle-20-solid" class="mt-0.5 h-5 w-5" />
    <div>
      <p class="font-medium">
        {{ title || "Success" }}
      </p>
      <p
        v-if="message"
        class="text-xs text-emerald-700/80 dark:text-emerald-100/80"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  title?: string;
  message?: string;
}>();
</script>
