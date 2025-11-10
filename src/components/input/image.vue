<template>
  <div class="space-y-2 cursor-pointer">
    <div class="flex items-center justify-between">
      <label
        v-if="label"
        :for="inputId"
        class="text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {{ label }}
      </label>
      <span
        v-if="fileSizeHint"
        class="text-xs text-slate-400 dark:text-slate-500"
      >
        {{ fileSizeHint }}
      </span>
    </div>

    <div
      class="relative rounded-2xl border border-dashed border-amber-300/60 bg-white/70 p-4 text-center transition-all duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-200/30 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-amber-400/60 dark:hover:shadow-amber-500/10"
      :class="{
        'opacity-60 pointer-events-none': disabled,
        'ring-2 ring-amber-400/60 dark:ring-amber-400/50': isDragOver,
        'border-rose-400/60 ring-2 ring-rose-200/60 dark:border-rose-500/60 dark:ring-rose-500/40':
          error,
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="handleContainerClick"
      role="button"
      tabindex="0"
      @keyup.enter="triggerFileDialog"
      @keyup.space.prevent="triggerFileDialog"
    >
      <input
        :id="inputId"
        ref="fileInput"
        type="file"
        class="sr-only"
        :accept="accept"
        :disabled="disabled"
        @change="onFileChange"
      />

      <div
        v-if="previewUrl"
        class="relative mx-auto flex h-48 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
      >
        <img
          :src="previewUrl"
          alt="Selected preview"
          class="h-full w-full object-cover"
        />
        <div
          class="absolute inset-0 bg-slate-900/0 transition hover:bg-slate-900/40"
        >
          <div
            class="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2"
          >
            <button
              type="button"
              class="glass-button bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200"
              @click.stop="triggerFileDialog"
              :disabled="disabled"
            >
              Change
            </button>
            <button
              type="button"
              class="glass-button bg-rose-500/95 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-rose-500/30 hover:bg-rose-500 disabled:cursor-not-allowed"
              @click.stop="clearSelection"
              :disabled="disabled"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex h-40 flex-col items-center justify-center gap-3">
        <Icon
          icon="heroicons-outline:photograph"
          class="h-12 w-12 text-amber-400/90 dark:text-amber-300/80"
        />
        <div class="space-y-1">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Drag & drop an image
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            or
            <button
              type="button"
              class="font-semibold text-amber-500 underline decoration-amber-500/40 decoration-dotted underline-offset-4 hover:text-amber-600"
              @click.stop="triggerFileDialog"
              :disabled="disabled"
            >
              browse files
            </button>
          </p>
        </div>
        <p class="text-[11px] text-slate-400 dark:text-slate-500">
          {{ acceptLabel }}
        </p>
      </div>
    </div>

    <p v-if="hint" class="text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
    <p v-if="error" class="text-xs font-semibold text-rose-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: File | string | null;
    label?: string;
    hint?: string;
    error?: string;
    accept?: string;
    disabled?: boolean;
    maxSizeMb?: number;
  }>(),
  {
    modelValue: null,
    accept: "image/*",
    disabled: false,
    maxSizeMb: 5,
  }
);

const emit = defineEmits<{
  (event: "update:modelValue", value: File | string | null): void;
  (event: "change", value: File | string | null): void;
  (event: "invalid-size", value: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isDragOver = ref(false);
const inputId = `image-input-${Math.random().toString(36).slice(2, 8)}`;
let objectUrl: string | null = null;

const acceptLabel = computed(() =>
  props.accept === "image/*" || !props.accept
    ? "PNG, JPG, JPEG, GIF · max 5MB"
    : props.accept
);

const fileSizeHint = computed(() => `Max ${props.maxSizeMb} MB`);

watch(
  () => props.modelValue,
  (value) => {
    resetPreview();
    if (!value) {
      previewUrl.value = null;
      return;
    }

    if (typeof value === "string") {
      previewUrl.value = value;
      return;
    }

    if (value instanceof File) {
      if (value.size > props.maxSizeMb * 1024 * 1024) {
        emit("invalid-size", value);
        emit("update:modelValue", null);
        return;
      }
      objectUrl = URL.createObjectURL(value);
      previewUrl.value = objectUrl;
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  resetPreview();
});

function resetPreview() {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
}

function triggerFileDialog() {
  if (props.disabled) return;
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;

  if (file && file.size > props.maxSizeMb * 1024 * 1024) {
    emit("invalid-size", file);
    target.value = "";
    return;
  }

  emit("update:modelValue", file);
  emit("change", file);
}

function clearSelection() {
  emit("update:modelValue", null);
  emit("change", null);
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}

function handleDragOver() {
  if (props.disabled) return;
  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

function handleDrop(event: DragEvent) {
  isDragOver.value = false;
  if (props.disabled) return;

  const file = event.dataTransfer?.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return;
  }

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    emit("invalid-size", file);
    return;
  }

  emit("update:modelValue", file);
  emit("change", file);

  if (fileInput.value) {
    // Keep input and dropped file in sync
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.value.files = dataTransfer.files;
  }
}

function handleContainerClick(event: MouseEvent) {
  if (props.disabled) return;
  const target = event.target as HTMLElement;
  if (target.closest("button")) {
    return;
  }
  triggerFileDialog();
}
</script>
