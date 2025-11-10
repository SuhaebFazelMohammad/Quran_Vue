<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <Heading
        title="Course Types"
        link="/course-type/create"
        buttonText="Add Course Type"
      />
      <div
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div
          class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
        >
          <span>Show</span>
          <Select
            :options="pageSizeOptions"
            v-model="pageSize"
            :clearable="false"
            :searchable="false"
            class="w-28"
          />
          <span>rows</span>
        </div>
        <SelectFilter
          :options="levelFilterOptions"
          v-model="selectedLevel"
          :clearable="true"
          :searchable="false"
          placeholder="Filter by level"
          icon="heroicons:adjustments-horizontal-20-solid"
        />
      </div>
    </div>

    <Table
      :columns="columns"
      :rows="filteredRows"
      :loading="loading"
      :pageSize="pageSizeNumber"
      :empty-text="emptyStateMessage"
      v-model:modelValuePage="page"
      @sort-change="onSortChange"
    >
      <template #cell-level="{ row }">
        <span class="inline-flex items-center gap-2">
          <span
            class="h-2 w-2 rounded-full"
            :class="
              row.level === 'Advanced' ? 'bg-emerald-500' : 'bg-amber-400'
            "
          ></span>
          {{ row.level }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <ShowButton :to="`/course-type/${row.id}`" />
          <EditButton :to="`/course-type/${row.id}/edit`" />
          <DeleteButton
            class="text-xs"
            :confirm-message="`Are you sure you want to delete ${row.name}?`"
            @confirm="handleDelete(row)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import Table, { type TableColumn } from "../../../components/table.vue";
import Select from "../../../components/input/select.vue";
import SelectFilter from "../../../components/input/selectFilter.vue";
import DeleteButton from "../../../components/buttons/delete.vue";
import EditButton from "../../../components/buttons/edit.vue";
import ShowButton from "../../../components/buttons/show.vue";
import { useSearchStore } from "../../../stores/search";
import Heading from "../../../components/heading.vue";

const loading = ref(false);
const page = ref(1);
const pageSize = ref<number | null>(10);

const searchStore = useSearchStore();
const { query } = storeToRefs(searchStore);

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

const levelFilterOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const selectedLevel = ref<string | null>(null);

const columns: TableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: false },
  { key: "level", label: "Level", sortable: true },
  { key: "actions", label: "Actions" },
];

const allRows = ref([
  {
    id: 1,
    name: "Foundations",
    description: "Introductory topics covering basics of recitation.",
    level: "Beginner",
  },
  {
    id: 2,
    name: "Hifz Support",
    description: "Structured revision plans for memorisation.",
    level: "Intermediate",
  },
  {
    id: 3,
    name: "Advanced Tajweed",
    description: "In-depth rules with practical application.",
    level: "Advanced",
  },
  {
    id: 4,
    name: "Arabic Language Skills",
    description: "Language tools that support Quranic understanding.",
    level: "Intermediate",
  },
]);

const filteredRows = computed(() => {
  const searchValue = query.value.trim().toLowerCase();
  const levelValue = selectedLevel.value?.toLowerCase() ?? "";

  return allRows.value.filter((row) => {
    const matchesSearch = searchValue
      ? [row.name, row.description, row.level]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      : true;

    const matchesLevel = levelValue
      ? row.level.toLowerCase() === levelValue
      : true;

    return matchesSearch && matchesLevel;
  });
});

const pageSizeNumber = computed(() => Number(pageSize.value ?? 10));

const emptyStateMessage = computed(() => {
  if (!filteredRows.value.length) {
    return query.value
      ? `No course types found for "${query.value}"`
      : "No data available";
  }
  return "No data available";
});

watch(query, () => {
  page.value = 1;
});

watch(selectedLevel, () => {
  page.value = 1;
});

watch([filteredRows, pageSizeNumber], ([rows, size]) => {
  const totalPages = Math.max(1, Math.ceil(rows.length / Math.max(size, 1)));
  if (page.value > totalPages) {
    page.value = totalPages;
  }
});

onMounted(() => {
  searchStore.setContext({
    placeholder: "Search course types by name, description, or level",
    emptyText: 'Try searching for "Foundations" or filtering by level',
  });
  searchStore.clearQuery();
});

onBeforeUnmount(() => {
  searchStore.resetContext();
  searchStore.clearQuery();
});

function onSortChange(payload: { key: string; direction: "asc" | "desc" }) {
  console.log("sort-change", payload);
}

function handleDelete(row: any) {
  console.log("delete", row);
}
</script>
