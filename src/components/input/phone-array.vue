<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >{{ label }}</label
    >

    <div
      :class="[
        'relative group rounded-xl border bg-white transition dark:bg-slate-950/60',
        error
          ? 'border-red-300 ring-4 dark:ring-2 ring-red-100 focus-within:border-red-400 focus-within:ring-red-200'
          : focused
          ? 'border-amber-300 ring-4 dark:ring-2 ring-amber-100 focus-within:border-amber-400 focus-within:ring-amber-200 dark:border-amber-400/70 dark:ring-amber-400/10'
          : 'border-slate-200 hover:bg-slate-50 focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-100 dark:border-slate-700 dark:hover:bg-slate-900/60 dark:focus-within:border-amber-400',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ]"
    >
      <!-- Left Icon -->
      <div
        v-if="iconLeft"
        class="pointer-events-none absolute left-3 top-3 text-slate-400 dark:text-slate-500"
      >
        <Icon :icon="iconLeft" class="w-5 h-5" />
      </div>

      <!-- Phone Numbers List -->
      <div
        :class="[
          'flex flex-wrap gap-2 p-3 min-h-[52px]',
          iconLeft ? 'pl-10' : '',
        ]"
      >
        <div
          v-for="(phone, index) in phoneNumbers"
          :key="index"
          class="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1.5 text-sm text-amber-800 dark:bg-amber-400/20 dark:text-amber-200"
        >
          <span>{{ phone }}</span>
          <button
            v-if="!disabled"
            type="button"
            @click="removePhone(index)"
            class="rounded p-0.5 text-amber-600 transition hover:bg-amber-200 dark:text-amber-300 dark:hover:bg-amber-400/30"
            aria-label="Remove phone number"
          >
            <Icon icon="heroicons:x-mark-20-solid" class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Input Field -->
        <input
          :id="id"
          ref="inputRef"
          type="tel"
          v-model="inputValue"
          :placeholder="phoneNumbers.length === 0 ? placeholder : 'Add another phone number'"
          :disabled="disabled"
          class="flex-1 min-w-[120px] border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.enter.prevent="addPhone"
          @keydown.tab="addPhone"
        />
      </div>
    </div>

    <!-- Helper Text -->
    <div class="mt-1.5 text-xs">
      <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
      <p v-else-if="hint" class="text-slate-500 dark:text-slate-400">{{ hint }}</p>
      <p v-else class="text-slate-500 dark:text-slate-400">
        Press Enter or Tab to add a phone number
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    modelValue: string | null | undefined;
    placeholder?: string;
    disabled?: boolean;
    hint?: string;
    error?: string;
    iconLeft?: string;
    required?: boolean;
  }>(),
  {
    placeholder: "Enter phone number",
    disabled: false,
    required: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const focused = ref(false);
const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

// Parse JSON array string to array
const phoneNumbers = ref<string[]>([]);

// Initialize from modelValue
function parseValue(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    if (typeof value === 'string' && value.startsWith('[')) {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((p) => p && String(p).trim()) : [];
    }
    // If it's a single string (not JSON), treat it as single phone number
    return value.trim() ? [value.trim()] : [];
  } catch {
    // If parsing fails, treat as single phone number
    return value.trim() ? [value.trim()] : [];
  }
}

// Watch modelValue changes from parent
watch(
  () => props.modelValue,
  (newValue) => {
    const parsed = parseValue(newValue);
    if (JSON.stringify(parsed) !== JSON.stringify(phoneNumbers.value)) {
      phoneNumbers.value = parsed;
    }
  },
  { immediate: true }
);

// Emit JSON array string when phoneNumbers change
watch(
  phoneNumbers,
  (newPhones) => {
    const jsonString = JSON.stringify(newPhones);
    emit("update:modelValue", jsonString);
  },
  { deep: true }
);

function addPhone() {
  const trimmed = inputValue.value.trim();
  if (!trimmed) return;

  // Check if phone number already exists
  if (phoneNumbers.value.includes(trimmed)) {
    inputValue.value = "";
    return;
  }

  phoneNumbers.value.push(trimmed);
  inputValue.value = "";
  
  // Refocus input
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0);
}

function removePhone(index: number) {
  phoneNumbers.value.splice(index, 1);
}
</script>

