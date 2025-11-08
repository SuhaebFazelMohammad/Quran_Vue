<template>
  <div class="relative inline-flex" ref="root">
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg border border-red-200/60 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      :class="{ 'pointer-events-none': processing }"
      :disabled="processing"
      @click="openConfirm"
    >
      <Icon icon="heroicons:trash-20-solid" class="h-4 w-4" />
      <slot>Delete</slot>
    </button>

    <BoxDelete
      :open="isConfirming"
      :message="confirmMessage"
      :confirm-text="confirmText"
      :cancel-text="cancelText"
      @confirm="confirm"
      @close="closeConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onUnmounted, ref } from "vue";
import BoxDelete from "../alerts/boxDelete.vue";

const props = withDefaults(
  defineProps<{
    confirmMessage?: string;
    confirmText?: string;
    cancelText?: string;
    processing?: boolean;
  }>(),
  {
    confirmMessage:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText: "Delete",
    cancelText: "Cancel",
    processing: false,
  }
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "click"): void;
  (e: "cancel"): void;
}>();

const isConfirming = ref(false);

function openConfirm() {
  if (props.processing) return;
  emit("click");
  isConfirming.value = true;
  document.addEventListener("keydown", onKeydown);
}

function closeConfirm() {
  isConfirming.value = false;
  emit("cancel");
  document.removeEventListener("keydown", onKeydown);
}

function confirm() {
  emit("confirm");
  closeConfirm();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeConfirm();
  }
}

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
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
