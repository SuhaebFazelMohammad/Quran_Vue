<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center gap-2 rounded-lg border border-sky-200/70 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-100 hover:border-sky-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
    :class="{ 'pointer-events-none': disabled || loading }"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span class="flex items-center justify-center">
      <Icon v-if="!loading" icon="heroicons:eye-20-solid" class="h-4 w-4" />
      <span
        v-else
        class="h-4 w-4 animate-spin rounded-full border-2 border-sky-400/70 border-r-transparent"
      ></span>
    </span>
    <slot>View</slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    to: string;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    to: "/",
    disabled: false,
    loading: false,
  }
);

const emit = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  if (props.disabled || props.loading) return;
  emit("click");
}
</script>
