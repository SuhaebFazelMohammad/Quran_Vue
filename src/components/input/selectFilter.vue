<template>
  <div class="w-full z-50" ref="root">
    <label
      v-if="label"
      :for="buttonId"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >{{ label }}</label
    >

    <div
      :class="[
        'relative',
        disabled ? 'opacity-60 pointer-events-none' : '',
        open ? 'z-40' : '',
      ]"
    >
      <button
        :id="buttonId"
        type="button"
        class="group flex w-full items-center justify-between gap-3 rounded-full border px-4 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-4"
        :class="buttonClasses"
        :aria-expanded="open ? 'true' : 'false'"
        role="combobox"
        :aria-controls="listboxId"
        @click="toggle()"
        @keydown.down.prevent="onArrow(1)"
        @keydown.up.prevent="onArrow(-1)"
        @keydown.enter.prevent="onEnter()"
        @keydown.esc.prevent="close()"
      >
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span
            class="inline-flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition group-hover:bg-amber-200  dark:bg-amber-400/20 dark:text-amber-200 dark:group-hover:bg-amber-400"
          >
            <Icon :icon="icon" class="h-4 w-4" />
          </span>

          <div class="flex min-w-0 flex-1 flex-col text-left">
            <span
              class="truncate text-sm font-semibold text-slate-800 dark:text-slate-100"
              :class="
                selectedOption ? '' : 'text-slate-500 dark:text-slate-400'
              "
            >
              {{ selectedOption ? selectedOptionLabel : placeholder }}
            </span>
            <span class="truncate text-xs text-slate-400 dark:text-slate-500">
              {{ hintText }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="clearable && selectedOption"
            type="button"
            class="rounded-full bg-slate-100 p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            @click.stop="clear()"
            aria-label="Clear selection"
          >
            <Icon icon="heroicons:x-mark-20-solid" class="h-4 w-4" />
          </button>
          <Icon
            icon="heroicons:chevron-down-20-solid"
            :class="[
              'h-4 w-4 text-slate-400 transition dark:text-slate-500',
              open ? 'rotate-180' : '',
            ]"
          />
        </div>
      </button>

      <transition name="fade">
        <div
          v-if="open"
          class="absolute z-50 mt-2 w-full rounded-2xl border border-amber-100/50 bg-white/98 shadow-md overflow-hidden shadow-amber-200/25 backdrop-blur-md ring-1 ring-amber-100/40 dark:border-slate-700/60 dark:bg-slate-950/95 dark:shadow-lg dark:shadow-black/50 dark:ring-slate-700/60"
        >
          <div
            v-if="searchable"
            class="border-b border-slate-200 p-2 dark:border-slate-800"
          >
            <div
              class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900/60"
            >
              <Icon
                icon="heroicons:magnifying-glass-20-solid"
                class="h-4 w-4 text-slate-400 dark:text-slate-500"
              />
              <input
                v-model="query"
                type="text"
                class="h-9 flex-1 bg-transparent text-sm text-slate-700 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="Search options..."
                @keydown.down.prevent="onArrow(1)"
                @keydown.up.prevent="onArrow(-1)"
                @keydown.enter.prevent="onEnter()"
                @keydown.esc.prevent="close()"
              />
            </div>
          </div>

          <ul
            :id="listboxId"
            role="listbox"
            class="max-h-64 overflow-auto py-2"
          >
            <li
              v-if="loading"
              class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
            >
              <span
                class="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-500/60 border-r-transparent align-middle"
              ></span>
              Loading...
            </li>

            <li
              v-else-if="filteredOptions.length === 0"
              class="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
            >
              {{ emptyText }}
            </li>

            <li
              v-for="(opt, index) in filteredOptions"
              :key="optionKey(opt, index)"
              role="option"
              :aria-selected="isSelected(opt) ? 'true' : 'false'"
              :class="optionClasses(opt, index)"
              @mouseenter="highlightIndex = index"
              @mouseleave="highlightIndex = -1"
              @click="select(opt)"
            >
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >{{ renderLabel(opt) }}</span
                >
                <span
                  v-if="opt.description"
                  class="rounded-full bg-slate-100/80 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800/70 dark:text-slate-300"
                >
                  {{ opt.description }}
                </span>
              </div>
              <Icon
                v-if="isSelected(opt)"
                icon="heroicons:check-20-solid"
                class="h-4 w-4 text-amber-500 dark:text-amber-300"
              />
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <p v-if="hint" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

type OptionValue = string | number | boolean | null;
export interface FilterOption<T = OptionValue> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
  [key: string]: unknown;
}

const buttonId = `filter-${Math.random().toString(36).slice(2, 8)}`;
const listboxId = `${buttonId}-listbox`;

const props = withDefaults(
  defineProps<{
    options: FilterOption[];
    modelValue: OptionValue | undefined;
    label?: string;
    placeholder?: string;
    hint?: string;
    hintWhenEmpty?: string;
    icon?: string;
    clearable?: boolean;
    searchable?: boolean;
    loading?: boolean;
    disabled?: boolean;
    emptyText?: string;
  }>(),
  {
    placeholder: "Choose filter",
    hintWhenEmpty: "Select an option to filter results",
    icon: "heroicons:funnel-20-solid",
    clearable: true,
    searchable: true,
    loading: false,
    disabled: false,
    emptyText: "No options available",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: OptionValue | undefined): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "search", query: string): void;
  (e: "clear"): void;
}>();

const open = ref(false);
const query = ref("");
const highlightIndex = ref(-1);
const root = ref<HTMLElement | null>(null);

const selectedOption = computed(
  () =>
    props.options.find((option) => option.value === props.modelValue) ?? null
);

const selectedOptionLabel = computed(() =>
  selectedOption.value ? renderLabel(selectedOption.value) : props.placeholder
);

const hintText = computed(() =>
  selectedOption.value ? props.hint ?? "Filter applied" : props.hintWhenEmpty
);

const filteredOptions = computed(() => {
  if (!props.searchable) {
    return props.options;
  }

  const normalizedQuery = query.value.toLowerCase().trim();
  if (!normalizedQuery) {
    return props.options;
  }

  const results = props.options.filter((option) =>
    renderLabel(option).toLowerCase().includes(normalizedQuery)
  );

  emit("search", normalizedQuery);
  return results;
});

const buttonClasses = computed(() => [
  "border-slate-200 bg-slate-50 text-slate-700 focus-visible:ring-amber-100 hover:bg-white hover:border-amber-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-amber-400/70 dark:hover:bg-slate-900/40",
  open.value
    ? "border-amber-300 bg-white shadow-md shadow-amber-200/25 dark:border-amber-400/70 dark:bg-slate-900/50 dark:shadow-md dark:shadow-black/40"
    : "",
]);

function optionClasses(option: FilterOption, index: number) {
  const base = "flex items-center justify-between px-4 py-2 text-sm transition";
  const highlighted = index === highlightIndex.value;
  const selected = isSelected(option);

  return [
    base,
    highlighted ? "bg-amber-500/12 dark:bg-amber-400/15" : "",
    selected
      ? "text-amber-700 font-semibold dark:text-amber-200"
      : "text-slate-700 dark:text-slate-200",
    option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ];
}

function renderLabel(option: FilterOption) {
  return String(option.label ?? option.value ?? "");
}

function optionKey(option: FilterOption, index: number) {
  return `${String(option.value)}-${index}`;
}

function toggle() {
  if (props.disabled) return;
  open.value ? close() : openDropdown();
}

function openDropdown() {
  if (open.value) return;
  open.value = true;
  highlightIndex.value = currentHighlightIndex();
  emit("open");
}

function close() {
  if (!open.value) return;
  open.value = false;
  highlightIndex.value = -1;
  emit("close");
}

function select(option: FilterOption) {
  if (option.disabled) return;
  emit("update:modelValue", option.value);
  close();
}

function clear() {
  emit("update:modelValue", undefined);
  emit("clear");
  query.value = "";
  highlightIndex.value = -1;
}

function isSelected(option: FilterOption) {
  return option.value === props.modelValue;
}

function onArrow(direction: 1 | -1) {
  if (!open.value) {
    openDropdown();
    return;
  }
  const enabled = filteredOptions.value.filter((option) => !option.disabled);
  if (enabled.length === 0) return;

  const currentValueIndex = enabled.findIndex(
    (option) => option.value === props.modelValue
  );
  let nextIndex = currentValueIndex + direction;

  if (nextIndex < 0) nextIndex = enabled.length - 1;
  if (nextIndex >= enabled.length) nextIndex = 0;

  const nextOption = enabled[nextIndex];
  if (!nextOption) return;

  const filteredIndex = filteredOptions.value.findIndex(
    (option) => option.value === nextOption.value
  );
  highlightIndex.value = filteredIndex;
  emit("update:modelValue", nextOption.value);
}

function onEnter() {
  if (!open.value) return;
  const option = filteredOptions.value[highlightIndex.value];
  if (option && !option.disabled) {
    select(option);
  }
}

function currentHighlightIndex() {
  const index = filteredOptions.value.findIndex(
    (option) => option.value === props.modelValue
  );
  return index >= 0 ? index : 0;
}

function onClickOutside(event: MouseEvent) {
  if (!root.value) return;
  if (!root.value.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

watch(
  () => props.disabled,
  (value) => {
    if (value) close();
  }
);

watch(
  () => props.modelValue,
  () => {
    if (!open.value) return;
    highlightIndex.value = currentHighlightIndex();
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
