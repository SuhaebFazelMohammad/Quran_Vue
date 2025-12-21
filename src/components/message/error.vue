<template>
  <div
    class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/40 dark:bg-red-400/15 dark:text-red-200"
  >
    <Icon
      icon="heroicons:exclamation-triangle-20-solid"
      class="mt-0.5 h-5 w-5"
    />
    <div>
      <p class="font-medium">
        {{ title || "Error" }}
      </p>
      <p v-if="message" class="text-xs">
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
