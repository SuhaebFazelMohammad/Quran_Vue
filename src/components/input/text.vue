<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="block mb-1.5 text-sm font-medium text-slate-700"
      >{{ label }}</label
    >

    <div
      :class="[
        'relative group',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ]"
    >
      <!-- Left Icon -->
      <div
        v-if="iconLeft"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      >
        <Icon :icon="iconLeft" class="w-5 h-5" />
      </div>

      <!-- Input -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autocomplete"
        class="w-full rounded-xl border px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 transition focus:outline-none"
        :class="[
          error
            ? 'border-red-300 ring-4 ring-red-100 focus:border-red-400 focus:ring-red-200'
            : focused
            ? 'border-amber-300 ring-4 ring-amber-100 focus:border-amber-400 focus:ring-amber-200'
            : 'border-slate-200 hover:bg-slate-50 focus:border-amber-300 focus:ring-4 focus:ring-amber-100',
          iconLeft ? 'pl-10' : '',
          iconRight || clearable ? 'pr-10' : '',
        ]"
        @input="handleInput"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.enter="
          $emit('enter', ($event.target as HTMLInputElement).value)
        "
      />

      <!-- Right Icons Container -->
      <div
        v-if="iconRight || (clearable && modelValue)"
        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1"
      >
        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue"
          type="button"
          class="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition"
          @click="clear"
          aria-label="Clear input"
        >
          <Icon icon="heroicons:x-mark-20-solid" class="w-4 h-4" />
        </button>

        <!-- Right Icon -->
        <div
          v-if="iconRight && (!clearable || !modelValue)"
          class="text-slate-400 pointer-events-none"
        >
          <Icon :icon="iconRight" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <!-- Helper Text -->
    <div class="mt-1.5 text-xs">
      <p v-if="error" class="text-red-600">{{ error }}</p>
      <p v-else-if="hint" class="text-slate-500">{{ hint }}</p>
      <p v-else-if="maxlength && showCharCount" class="text-slate-500">
        {{ charCount }} / {{ maxlength }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    modelValue: string | number | null | undefined;
    type?: "text" | "email" | "password" | "tel" | "url" | "search" | "number";
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    maxlength?: number;
    minlength?: number;
    autocomplete?: string;
    hint?: string;
    error?: string;
    iconLeft?: string;
    iconRight?: string;
    showCharCount?: boolean;
  }>(),
  {
    type: "text",
    disabled: false,
    readonly: false,
    clearable: false,
    showCharCount: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "enter", value: string): void;
  (e: "focus"): void;
  (e: "blur"): void;
}>();

const focused = ref(false);

const charCount = computed(() => {
  return String(props.modelValue || "").length;
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function clear() {
  emit("update:modelValue", "");
}
</script>
