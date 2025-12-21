<template>
  <div class="w-full" ref="root">
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >{{ label }}</label
    >

    <div
      :class="[
        'relative group',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ]"
    >
      <!-- Search Input -->
      <div class="relative">
        <!-- Left Icon -->
        <div
          v-if="iconLeft"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        >
          <Icon :icon="iconLeft" class="w-5 h-5" />
        </div>

        <input
          :id="id"
          ref="inputRef"
          type="text"
          :value="query || displayValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full rounded-xl border px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 transition focus:outline-none dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          :class="[
            error
              ? 'border-red-300 ring-4 dark:ring-2 ring-red-100 focus:border-red-400 focus:ring-red-200'
              : focused
              ? 'border-amber-300 ring-4 dark:ring-2 ring-amber-100 focus:border-amber-400 focus:ring-amber-200 dark:border-amber-400/70 dark:ring-amber-400/10'
              : 'border-slate-200 hover:bg-slate-50 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:hover:bg-slate-900/60 dark:focus:border-amber-400',
            iconLeft ? 'pl-10' : '',
            clearable && modelValue ? 'pr-10' : '',
          ]"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.down.prevent="onArrow(1)"
          @keydown.up.prevent="onArrow(-1)"
          @keydown.enter.prevent="onEnter"
          @keydown.esc.prevent="closeDropdown"
        />

        <!-- Clear Button -->
        <button
          v-if="clearable && modelValue"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
          @click="clear"
          aria-label="Clear selection"
        >
          <Icon icon="heroicons:x-mark-20-solid" class="w-4 h-4" />
        </button>
      </div>

      <!-- Dropdown -->
      <transition name="fade" appear>
        <div
          v-if="open"
          class="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950/90"
        >
          <ul
            :id="listboxId"
            role="listbox"
            class="max-h-64 overflow-auto py-1"
          >
            <li
              v-if="filteredOptions.length === 0"
              class="px-3 py-6 text-center text-slate-500 dark:text-slate-400"
            >
              {{ emptyText }}
            </li>
            <li
              v-for="(opt, i) in filteredOptions"
              :key="optionKey(opt, i)"
              role="option"
              :aria-selected="isSelected(opt) ? 'true' : 'false'"
              :class="[
                'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition',
                i === highlightIndex ? 'bg-amber-50 dark:bg-amber-400/10' : '',
                isSelected(opt)
                  ? 'font-medium text-amber-700 dark:text-amber-200'
                  : 'text-slate-700 dark:text-slate-200',
              ]"
              @mouseenter="highlightIndex = i"
              @mouseleave="highlightIndex = -1"
              @click="select(opt)"
            >
              <slot name="option" :option="opt">
                <span>{{ renderDisplayLabel(opt) }}</span>
              </slot>
              <Icon
                v-if="isSelected(opt)"
                icon="heroicons:check-20-solid"
                class="h-4 w-4 text-amber-600 dark:text-amber-300"
              />
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- Helper Text -->
    <div class="mt-1.5 text-xs">
      <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
      <p v-else-if="hint" class="text-slate-500 dark:text-slate-400">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";

type OptionValue = string | number | boolean | null;
export interface SearchSelectOption<T = OptionValue> {
  label?: string;
  value: T;
  disabled?: boolean;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    options: SearchSelectOption[];
    modelValue: OptionValue | undefined;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    emptyText?: string;
    optionLabelKey?: string;
    hint?: string;
    error?: string;
    iconLeft?: string;
    required?: boolean;
  }>(),
  {
    placeholder: "Search...",
    clearable: true,
    disabled: false,
    emptyText: "No results found",
    optionLabelKey: "label",
    required: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: OptionValue | undefined): void;
  (
    e: "change",
    payload: { value: OptionValue | undefined; option: SearchSelectOption | null }
  ): void;
  (e: "search", query: string): void;
}>();

const open = ref(false);
const query = ref("");
const highlightIndex = ref(-1);
const root = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const focused = ref(false);

const listboxId = computed(() => `${props.id || "search-select"}-listbox`);

const selectedOption = computed<SearchSelectOption | null>(() => {
  return props.options.find((o) => o.value === props.modelValue) ?? null;
});

const displayValue = computed(() => {
  if (query.value) return query.value;
  return selectedOption.value ? renderDisplayLabel(selectedOption.value) : "";
});

const filteredOptions = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (q.length === 0) return props.options.slice(0, 10); // Show first 10 when no query
  
  const list = props.options.filter((o) => {
    const label = renderLabel(o).toLowerCase();
    // Also search in option data if it has additional fields
    const optionData = o as any;
    const searchFields = [
      label,
      optionData.first_name?.toLowerCase() || "",
      optionData.last_name?.toLowerCase() || "",
      optionData.email?.toLowerCase() || "",
      optionData.phone_num?.toLowerCase() || "",
      optionData.phone?.toLowerCase() || "",
    ].filter(Boolean);
    
    return searchFields.some((field) => field.includes(q));
  });
  
  emit("search", q);
  return list;
});

function renderLabel(opt: SearchSelectOption): string {
  const key = props.optionLabelKey;
  const raw = (opt as any)?.[key] ?? opt.label ?? String(opt.value ?? "");
  return String(raw);
}

function renderDisplayLabel(opt: SearchSelectOption): string {
  // If option has first_name and last_name, show only those
  const optionData = opt as any;
  if (optionData.first_name || optionData.last_name) {
    return `${optionData.first_name || ""} ${optionData.last_name || ""}`.trim() || renderLabel(opt);
  }
  // Otherwise use the label
  return renderLabel(opt);
}

function isSelected(opt: SearchSelectOption): boolean {
  return opt.value === props.modelValue;
}

function optionKey(opt: SearchSelectOption, i: number) {
  return `${String(opt.value)}-${i}`;
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  query.value = target.value;
  open.value = true;
  highlightIndex.value = 0;
}

function handleFocus() {
  focused.value = true;
  // Always clear query when focusing to allow searching/selecting again
  query.value = "";
  open.value = true;
  // Reset highlight to first option
  highlightIndex.value = 0;
}

function handleBlur() {
  focused.value = false;
  // Delay closing to allow click on option
  setTimeout(() => {
    if (!focused.value) {
      closeDropdown();
      // If no selection made and query exists, clear query
      if (!selectedOption.value && query.value) {
        query.value = "";
      } else if (selectedOption.value && query.value) {
        // If user has selection, clear query to show selected value
        query.value = "";
      }
    }
  }, 200);
}

function closeDropdown() {
  open.value = false;
  highlightIndex.value = -1;
}

function select(opt: SearchSelectOption) {
  if (opt.disabled) return;
  emit("update:modelValue", opt.value);
  emit("change", { value: opt.value, option: opt });
  query.value = "";
  closeDropdown();
  // Keep focus so user can click again to change selection
  // inputRef.value?.blur();
}

function clear() {
  emit("update:modelValue", undefined);
  emit("change", { value: undefined, option: null });
  query.value = "";
  inputRef.value?.focus();
}

function onArrow(delta: 1 | -1) {
  if (!open.value) {
    open.value = true;
    return;
  }
  const max = filteredOptions.value.length;
  if (max === 0) return;
  let next = highlightIndex.value + delta;
  if (next < 0) next = max - 1;
  if (next >= max) next = 0;
  highlightIndex.value = next;
}

function onEnter() {
  if (!open.value) return;
  const opt = filteredOptions.value[highlightIndex.value];
  if (opt) select(opt);
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (root.value && !root.value.contains(target)) {
    closeDropdown();
  }
}

// Watch modelValue to update query when selection changes externally
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null || newValue === undefined) {
      query.value = "";
    } else if (!query.value) {
      // Only update if query is empty (to avoid overwriting user input)
      const option = props.options.find((o) => o.value === newValue);
      if (option) {
        query.value = "";
      }
    }
  }
);

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

watch(
  () => props.disabled,
  (v) => {
    if (v) closeDropdown();
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

