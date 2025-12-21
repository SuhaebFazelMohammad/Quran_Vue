<template>
  <div class="w-full" ref="rootEl">
    <label
      v-if="label"
      :for="id"
      class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {{ label }}
    </label>

    <div
      :class="[
        'relative group',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ]"
    >
      <!-- Left calendar icon -->
      <div
        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      >
        <Icon icon="heroicons:calendar-days-20-solid" class="w-5 h-5" />
      </div>

      <!-- Display input (text) -->
      <input
        :id="id"
        type="text"
        :value="displayLabel"
        :placeholder="placeholder || 'YYYY-MM-DD'"
        :disabled="disabled"
        readonly
        class="w-full rounded-xl border px-3 py-2.5 bg-white text-slate-800 placeholder:text-slate-400 transition focus:outline-none dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 cursor-pointer"
        :class="[
          error
            ? 'border-red-300 ring-4 dark:ring-2 ring-red-100 focus:border-red-400 focus:ring-red-200'
            : isOpen || focused
            ? 'border-amber-300 ring-4 dark:ring-2 ring-amber-100 focus:border-amber-400 focus:ring-amber-200 dark:border-amber-400/70 dark:ring-amber-400/10'
            : 'border-slate-200 hover:bg-slate-50 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:hover:bg-slate-900/60 dark:focus:border-amber-400',
          'pl-10',
          clearable && modelValue ? 'pr-10' : '',
        ]"
        @focus="onFocus"
        @blur="onBlur"
        @click="toggleOpen"
      />

      <!-- Clear button -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
        @click.stop="clear"
        aria-label="Clear date"
      >
        <Icon icon="heroicons:x-mark-20-solid" class="w-4 h-4" />
      </button>

      <!-- Popover calendar -->
      <transition name="fade">
        <div
          v-if="isOpen"
          class="absolute z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 text-xs shadow-lg shadow-slate-900/5 dark:border-slate-700 dark:bg-slate-950"
        >
          <!-- Search / quick-jump -->
          <div
            v-if="showSearch"
            class="mb-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-[0.7rem] text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
          >
            <Icon
              icon="heroicons:magnifying-glass-20-solid"
              class="h-3.5 w-3.5 text-slate-400 dark:text-slate-500"
            />
            <input
              v-model="searchValue"
              type="text"
              class="w-full bg-transparent text-[0.7rem] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Jump to date e.g. 2025-03-15 or 2025-03"
              @keydown.enter.prevent="applySearch"
            />
          </div>

          <div class="mb-2 flex items-center justify-between">
            <button
              type="button"
              class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              @click="prevMonth"
            >
              <Icon icon="heroicons:chevron-left-20-solid" class="h-4 w-4" />
            </button>
            <div
              class="text-[0.78rem] font-semibold text-slate-700 dark:text-slate-200"
            >
              {{ monthLabel }} {{ currentYear }}
            </div>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              @click="nextMonth"
            >
              <Icon icon="heroicons:chevron-right-20-solid" class="h-4 w-4" />
            </button>
          </div>

          <div
            class="mb-1 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
          >
            <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-[0.72rem]">
            <button
              v-for="day in days"
              :key="day.key"
              type="button"
              :disabled="day.disabled"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:text-slate-200 dark:hover:border-amber-400/60 dark:hover:bg-amber-400/10 dark:hover:text-amber-200"
              :class="[
                day.isToday
                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/70 dark:bg-amber-400/10 dark:text-amber-200'
                  : '',
                day.isSelected
                  ? 'bg-amber-500 text-white hover:bg-amber-600 hover:text-white dark:bg-amber-500'
                  : '',
                day.isOutside
                  ? 'text-slate-300 hover:text-slate-400 dark:text-slate-600 dark:hover:text-slate-400'
                  : '',
                day.disabled
                  ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-inherit'
                  : '',
              ]"
              @click="selectDay(day)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- Helper text -->
    <div class="mt-1.5 text-xs">
      <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>
      <p v-else-if="hint" class="text-slate-500 dark:text-slate-400">
        {{ hint }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    label?: string;
    modelValue: string | null | undefined;
    placeholder?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    hint?: string;
    error?: string;
    showSearch?: boolean;
  }>(),
  {
    disabled: false,
    readonly: false,
    clearable: false,
    showSearch: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "focus"): void;
  (e: "blur"): void;
}>();

const rootEl = ref<HTMLElement | null>(null);
const focused = ref(false);
const isOpen = ref(false);
const searchValue = ref(props.modelValue || "");

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth()); // 0-11

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const displayLabel = computed(() => props.modelValue || "");

const monthLabel = computed(() => monthNames[currentMonth.value]);

type DayCell = {
  key: string;
  label: number;
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  isOutside: boolean;
  disabled: boolean;
};

const days = computed<DayCell[]>(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const result: DayCell[] = [];

  // Previous month trailing days
  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    result.push(createDayCell(date, true));
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    result.push(createDayCell(date, false));
  }

  // Next month leading days to fill 6 weeks (42 cells)
  const remaining = 42 - result.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    result.push(createDayCell(date, true));
  }

  return result;
});

function createDayCell(date: Date, isOutside: boolean): DayCell {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const iso = `${yyyy}-${mm}-${dd}`;

  const todayIso = formatDateToIso(today);
  const selectedIso = props.modelValue || "";

  const min = props.min ? new Date(props.min) : null;
  const max = props.max ? new Date(props.max) : null;
  const disabled =
    (min && date < min) || (max && date > max) || props.disabled === true;

  return {
    key: iso,
    label: date.getDate(),
    date,
    isToday: iso === todayIso,
    isSelected: iso === selectedIso,
    isOutside,
    disabled,
  };
}

function formatDateToIso(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toggleOpen() {
  if (props.disabled || props.readonly) return;
  if (!isOpen.value && props.modelValue) {
    // When opening, sync calendar to current value if valid
    const parsed = parseIsoDate(props.modelValue);
    if (parsed) {
      currentYear.value = parsed.getFullYear();
      currentMonth.value = parsed.getMonth();
    }
  }
  searchValue.value = props.modelValue || "";
  isOpen.value = !isOpen.value;
}

function clear() {
  emit("update:modelValue", "");
}

function onFocus() {
  focused.value = true;
  emit("focus");
}

function onBlur() {
  focused.value = false;
  emit("blur");
}

function handleClickOutside(event: MouseEvent) {
  if (!isOpen.value) return;
  const target = event.target as Node | null;
  if (rootEl.value && target && !rootEl.value.contains(target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}

function selectDay(day: DayCell) {
  if (day.disabled) return;
  const iso = formatDateToIso(day.date);
  emit("update:modelValue", iso);
  isOpen.value = false;
}

function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length < 2 || parts.length > 3) return null;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = parts.length === 3 ? Number(parts[2]) : 1;
  if (!year || !month || Number.isNaN(year) || Number.isNaN(month)) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function applySearch() {
  const parsed = parseIsoDate(searchValue.value);
  if (!parsed) return;
  currentYear.value = parsed.getFullYear();
  currentMonth.value = parsed.getMonth();

  // If full date (YYYY-MM-DD) provided, also select it
  if (searchValue.value.split("-").length === 3) {
    emit("update:modelValue", formatDateToIso(parsed));
    isOpen.value = false;
  }
}
</script>
