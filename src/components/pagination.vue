<template>
  <div
    v-bind="passthroughAttrs"
    :class="[
      'flex items-center justify-between text-sm text-slate-600',
      rootClass,
    ]"
  >
    <div class="text-slate-500">
      Showing
      <span class="font-medium text-slate-700">{{ displayStart }}</span>
      to
      <span class="font-medium text-slate-700">{{ displayEnd }}</span>
      of
      <span class="font-medium text-slate-700">{{ total }}</span>
      entries
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isFirstPage"
        @click="goTo(page - 1)"
        aria-label="Go to previous page"
      >
        Prev
      </button>
      <span class="px-2 text-slate-600"
        >Page {{ page }} / {{ totalPages }}</span
      >
      <button
        type="button"
        class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLastPage"
        @click="goTo(page + 1)"
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    page: number;
    pageSize: number;
    total: number;
  }>(),
  {
    page: 1,
    pageSize: 10,
    total: 0,
  }
);

const emit = defineEmits<{
  (e: "update:page", value: number): void;
  (e: "change", payload: { page: number; pageSize: number }): void;
}>();

const attrs = useAttrs();

const totalPages = computed(() => {
  if (props.pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(props.total / props.pageSize));
});

const currentPage = computed(() => {
  const max = totalPages.value;
  if (props.page < 1) return 1;
  if (props.page > max) return max;
  return props.page;
});

const displayStart = computed(() => {
  if (props.total === 0) return 0;
  return (currentPage.value - 1) * props.pageSize + 1;
});

const displayEnd = computed(() => {
  if (props.total === 0) return 0;
  return Math.min(props.total, currentPage.value * props.pageSize);
});

const isFirstPage = computed(() => currentPage.value <= 1);
const isLastPage = computed(() => currentPage.value >= totalPages.value);

const rootClass = computed(() => (attrs as Record<string, unknown>).class);
const passthroughAttrs = computed(() => {
  const { class: _class, ...rest } = attrs as Record<string, unknown>;
  return rest;
});

function goTo(target: number) {
  const max = totalPages.value;
  const next = Math.min(max, Math.max(1, target));
  if (next === currentPage.value) return;
  emit("update:page", next);
  emit("change", { page: next, pageSize: props.pageSize });
}
</script>
