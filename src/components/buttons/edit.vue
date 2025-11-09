<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center gap-2 rounded-lg border border-emerald-200/60 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100 hover:border-emerald-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span class="flex items-center justify-center">
      <Icon
        v-if="!loading"
        icon="heroicons:pencil-square-20-solid"
        class="h-4 w-4"
      />
      <span
        v-else
        class="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/70 border-r-transparent"
      ></span>
    </span>
    <slot>Edit</slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
    to: string;
  }>(),
  {
    disabled: false,
    loading: false,
    to: "/",
  }
);

const emit = defineEmits<{
  (e: "click"): void;
}>();

function handleClick() {
  if (props.disabled || props.loading) {
    return;
  }
  emit("click");
}
</script>
