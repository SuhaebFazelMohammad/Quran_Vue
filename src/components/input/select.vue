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
      <!-- Control -->
      <button
        :id="id"
        type="button"
        class="inline-flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 bg-white text-left text-slate-800 transition focus:outline-none dark:bg-slate-950/60 dark:text-slate-100"
        :class="[
          error
            ? 'border-red-300 ring-4 ring-red-100 dark:border-red-400/70'
            : open
            ? 'border-amber-300 ring-4 ring-amber-100 dark:border-amber-400/70 dark:ring-amber-400/10'
            : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900/60',
        ]"
        :aria-expanded="open ? 'true' : 'false'"
        role="combobox"
        :aria-controls="listboxId"
        @click="toggle()"
        @keydown.down.prevent="onArrow(1)"
        @keydown.up.prevent="onArrow(-1)"
        @keydown.enter.prevent="onEnter()"
        @keydown.esc.prevent="close()"
      >
        <div class="flex-1 min-w-0 flex items-center gap-2">
          <span v-if="selectedOption" class="truncate">{{
            renderLabel(selectedOption)
          }}</span>
          <span v-else class="truncate text-slate-400">{{ placeholder }}</span>
        </div>

        <div class="flex items-center gap-1">
          <span
            v-if="clearable && modelValue != null"
            class="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
            @click.stop="clear()"
            aria-label="Clear selection"
            >✕</span
          >
          <Icon
            :icon="'heroicons:chevron-down-20-solid'"
            :class="['h-4 w-4 transition', open ? 'rotate-180' : '']"
          />
        </div>
      </button>

      <!-- Dropdown -->
      <transition name="fade" appear>
        <div
          v-if="open"
          class="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950/90"
        >
          <!-- Search -->
          <div v-if="searchable" class="border-b border-slate-200 p-2 dark:border-slate-800">
            <input
              v-model.trim="query"
              type="text"
              class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-400"
              placeholder="Search..."
              @keydown.down.prevent="onArrow(1)"
              @keydown.up.prevent="onArrow(-1)"
              @keydown.enter.prevent="onEnter()"
              @keydown.esc.prevent="close()"
            />
          </div>

          <!-- List -->
          <ul
            :id="listboxId"
            role="listbox"
            class="max-h-64 overflow-auto py-1"
          >
            <li v-if="loading" class="px-3 py-6 text-center text-slate-500 dark:text-slate-400">
              <span
                class="mr-2 inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-500/60 border-r-transparent align-middle"
              ></span>
              Loading...
            </li>

            <li
              v-else-if="filteredOptions.length === 0"
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
                <span>{{ renderLabel(opt) }}</span>
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
export interface SelectOption<T = OptionValue> {
  label?: string;
  value: T;
  disabled?: boolean;
  [key: string]: any;
}

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    options: SelectOption[];
    modelValue: OptionValue | undefined;
    placeholder?: string;
    clearable?: boolean;
    searchable?: boolean;
    disabled?: boolean;
    loading?: boolean;
    emptyText?: string;
    optionLabelKey?: string;
    hint?: string;
    error?: string;
  }>(),
  {
    placeholder: "Select...",
    clearable: true,
    searchable: true,
    disabled: false,
    loading: false,
    emptyText: "No options",
    optionLabelKey: "label",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: OptionValue | undefined): void;
  (
    e: "change",
    payload: { value: OptionValue | undefined; option: SelectOption | null }
  ): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "search", query: string): void;
}>();

const open = ref(false);
const query = ref("");
const highlightIndex = ref(-1);
const root = ref<HTMLElement | null>(null);

const listboxId = computed(() => `${props.id || "select"}-listbox`);

const selectedOption = computed<SelectOption | null>(() => {
  return props.options.find((o) => o.value === props.modelValue) ?? null;
});

const filteredOptions = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!props.searchable || q.length === 0) return props.options;
  const list = props.options.filter((o) =>
    renderLabel(o).toLowerCase().includes(q)
  );
  emit("search", q);
  return list;
});

function renderLabel(opt: SelectOption): string {
  const key = props.optionLabelKey;
  const raw = (opt as any)?.[key] ?? opt.label ?? String(opt.value ?? "");
  return String(raw);
}

function isSelected(opt: SelectOption): boolean {
  return opt.value === props.modelValue;
}

function optionKey(opt: SelectOption, i: number) {
  return `${String(opt.value)}-${i}`;
}

function toggle() {
  if (props.disabled) return;
  open.value ? close() : openDropdown();
}

function openDropdown() {
  if (open.value) return;
  open.value = true;
  highlightIndex.value = Math.max(
    0,
    filteredOptions.value.findIndex(isSelected)
  );
  emit("open");
}

function close() {
  if (!open.value) return;
  open.value = false;
  highlightIndex.value = -1;
  emit("close");
}

function select(opt: SelectOption) {
  if (opt.disabled) return;
  emit("update:modelValue", opt.value);
  emit("change", { value: opt.value, option: opt });
  close();
}

function clear() {
  emit("update:modelValue", undefined);
  emit("change", { value: undefined, option: null });
}

function onArrow(delta: 1 | -1) {
  if (!open.value) {
    openDropdown();
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
  if (root.value && !root.value.contains(target)) close();
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

watch(
  () => props.disabled,
  (v) => {
    if (v) close();
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
