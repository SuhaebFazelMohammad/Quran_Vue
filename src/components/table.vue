<template>
  <div class="relative">
    <div
      class="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-xl shadow-amber-500/10 backdrop-blur-lg transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-900/60 dark:shadow-black/40"
    >
      <table class="min-w-full text-left text-sm text-slate-700 dark:text-slate-200">
        <thead class="bg-slate-50/90 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              scope="col"
              class="px-5 py-4 text-xs font-semibold uppercase tracking-wide select-none"
            >
              <button
                v-if="col.sortable"
                type="button"
                class="inline-flex items-center gap-1 transition hover:text-amber-600 dark:hover:text-amber-300"
                @click="toggleSort(col)"
              >
                <span>{{ col.label }}</span>
                <svg
                  v-if="sort.key !== col.key"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-4 w-4 text-slate-400 dark:text-slate-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 01.894.553l4 8A1 1 0 0114 13H6a1 1 0 01-.894-1.447l4-8A1 1 0 0110 3zm0 3.618L7.618 11h4.764L10 6.618z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else-if="sort.direction === 'asc'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-4 w-4 text-amber-600 dark:text-amber-300"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-4 w-4 text-amber-600 dark:text-amber-300"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4A1 1 0 013 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200/60 dark:divide-slate-800/70">
          <tr
            v-for="(row, idx) in pagedRows"
            :key="rowKey(row, idx)"
            :class="[
              striped && idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-slate-900/40' : '',
              hoverable ? 'transition hover:bg-amber-50/40 dark:hover:bg-amber-400/10' : '',
            ]"
          >
            <td
              v-for="col in columns"
              :key="String(col.key)"
              class="px-5 py-4 align-middle text-sm"
            >
              <slot :name="`cell-${String(col.key)}`" :row="row" :column="col">
                <span>{{ resolveCell(row, col) }}</span>
              </slot>
            </td>
          </tr>

          <tr v-if="!loading && totalRows === 0">
            <td
              :colspan="columns.length"
              class="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              {{ emptyText }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Loading v-if="loading" />

    <Pagination
      v-if="showPagination"
      class="mt-3"
      :page="currentPage"
      :page-size="props.pageSize"
      :total="totalRows"
      @update:page="goTo"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import Pagination from "./pagination.vue";
import Loading from "./loading.vue";

type Primitive = string | number | boolean | null | undefined;

export interface TableColumn<Row = any> {
  key: keyof Row | string;
  label: string;
  sortable?: boolean;
}

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    rows: any[];
    loading?: boolean;
    emptyText?: string;
    striped?: boolean;
    hoverable?: boolean;
    pageSize?: number;
    modelValuePage?: number;
  }>(),
  {
    rows: () => [],
    loading: false,
    emptyText: "No data available",
    striped: true,
    hoverable: true,
    pageSize: 10,
    modelValuePage: 1,
  }
);

const emit = defineEmits<{
  (e: "update:modelValuePage", value: number): void;
  (e: "row-click", row: any): void;
  (e: "sort-change", payload: { key: string; direction: "asc" | "desc" }): void;
}>();

const sort = reactive<{ key: string | null; direction: "asc" | "desc" }>({
  key: null,
  direction: "asc",
});

function toggleSort(col: TableColumn) {
  const key = String(col.key);
  if (sort.key !== key) {
    sort.key = key;
    sort.direction = "asc";
  } else {
    sort.direction = sort.direction === "asc" ? "desc" : "asc";
  }
  emit("sort-change", { key, direction: sort.direction });
}

function compare(a: Primitive, b: Primitive) {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

const sortedRows = computed(() => {
  const data = [...props.rows];
  if (!sort.key) return data;
  return data.sort((r1, r2) => {
    const v1 = (r1 as any)[sort.key as any] as Primitive;
    const v2 = (r2 as any)[sort.key as any] as Primitive;
    const base = compare(v1, v2);
    return sort.direction === "asc" ? base : -base;
  });
});

const totalRows = computed(() => sortedRows.value.length);

const showPagination = computed(() => totalRows.value > props.pageSize);

const currentPage = computed({
  get: () => props.modelValuePage,
  set: (val: number) => emit("update:modelValuePage", val),
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalRows.value / props.pageSize))
);
const startRow = computed(() => (currentPage.value - 1) * props.pageSize);
const endRow = computed(() =>
  Math.min(totalRows.value, startRow.value + props.pageSize)
);

const pagedRows = computed(() =>
  sortedRows.value.slice(startRow.value, endRow.value)
);

function rowKey(row: any, idx: number) {
  return row.id ?? idx;
}

function resolveCell(row: any, col: TableColumn) {
  const key = String(col.key);
  return (row as any)?.[key];
}

function goTo(page: number) {
  const next = Math.min(totalPages.value, Math.max(1, page));
  currentPage.value = next;
}
</script>
