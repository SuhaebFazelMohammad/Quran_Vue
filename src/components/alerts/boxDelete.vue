<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="props.open"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full max-w-sm rounded-2xl border border-red-200/70 bg-white p-6 text-slate-700 shadow-2xl shadow-red-300/20"
        >
          <div class="flex items-start gap-3">
            <span
              class="inline-flex size-10 items-center justify-center rounded-full bg-red-100 text-red-500"
            >
              <Icon
                icon="heroicons:exclamation-triangle-20-solid"
                class="h-5 w-5"
              />
            </span>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-slate-900">
                {{ props.title }}
              </h3>
              <p class="mt-1 text-sm text-slate-600">
                <slot>{{ props.message }}</slot>
              </p>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              @click="close"
            >
              {{ props.cancelText }}
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-red-500/70 bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
              @click="confirm"
            >
              <Icon icon="heroicons:trash-20-solid" class="h-4 w-4" />
              {{ props.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }>(),
  {
    title: "Confirm Delete",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
  }
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "close"): void;
}>();

function close() {
  emit("close");
}

function confirm() {
  emit("confirm");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
