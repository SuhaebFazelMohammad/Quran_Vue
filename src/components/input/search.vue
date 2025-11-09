<template>
  <div
    class="group relative flex flex-col gap-y-1 text-slate-700 dark:text-slate-200"
    :class="attrs.class"
  >
    <label class="sr-only" :for="inputId">{{ placeholder || "Search" }}</label>
    <div
      class="flex items-center gap-x-2 rounded-2xl border border-amber-200 bg-white/80 px-3 py-2 text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-200 group-focus-within:-translate-y-px group-focus-within:border-amber-300 group-focus-within:shadow-lg group-focus-within:shadow-amber-100/60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:group-focus-within:border-amber-400/70 dark:group-focus-within:shadow-black/40"
    >
      <Icon
        icon="heroicons:magnifying-glass-20-solid"
        class="h-5 w-5 text-amber-500 transition-colors duration-200 group-focus-within:text-amber-600"
      />
      <input
        v-bind="inputAttrs"
        :id="inputId"
        ref="inputRef"
        type="text"
        class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.esc.prevent="clear"
      />
      <transition name="fade">
        <button
          v-if="hasValue"
          type="button"
          class="rounded-md bg-amber-100/80 p-1 text-amber-600 transition hover:bg-amber-200 dark:bg-amber-400/20 dark:text-amber-200 dark:hover:bg-amber-400/30"
          @click="clear"
          aria-label="Clear search"
        >
          <Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" />
        </button>
      </transition>
    </div>
    <transition name="scale">
      <div
        v-if="showHint"
        class="absolute left-0 right-0 top-full mt-1 origin-top overflow-hidden rounded-xl border border-amber-100 bg-white/95 p-3 text-xs text-slate-500 shadow-lg shadow-amber-100/50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:shadow-black/40"
      >
        <p class="flex items-start gap-x-2 leading-snug">
          <Icon
            icon="heroicons:light-bulb-20-solid"
            class="h-4 w-4 text-amber-500"
          />
          <span>{{ emptyText }}</span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from "vue";
import { Icon } from "@iconify/vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  emptyText?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const attrs = useAttrs();
const inputRef = ref<HTMLInputElement | null>(null);
const isFocused = ref(false);

const inputId = `search-${Math.random().toString(36).slice(2, 8)}`;

const inputAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const hasValue = computed(() => props.modelValue?.length > 0);
const showHint = computed(
  () => Boolean(props.emptyText) && !hasValue.value && isFocused.value
);

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}

function onFocus(event: FocusEvent) {
  isFocused.value = true;
  emit("focus", event);
}

function onBlur(event: FocusEvent) {
  isFocused.value = false;
  emit("blur", event);
}

function clear() {
  emit("update:modelValue", "");
  inputRef.value?.focus();
}

onMounted(() => {
  if (attrs.autofocus) {
    inputRef.value?.focus();
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.scale-enter-active,
.scale-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
