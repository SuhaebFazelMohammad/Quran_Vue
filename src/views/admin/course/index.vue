<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Courses
        </h1>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
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
          :options="categoryFilterOptions"
          v-model="selectedCategory"
          :clearable="true"
          :searchable="false"
          placeholder="Filter by category"
          icon="heroicons:bookmark-20-solid"
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
      <template #cell-category="{ row }">
        <span class="inline-flex items-center gap-2">
          <span
            class="h-2 w-2 rounded-full"
            :class="row.category === 'Tajweed' ? 'bg-emerald-500' : 'bg-amber-400'"
          ></span>
          {{ row.category }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <ShowButton :to="`/course/${row.id}`" />
          <EditButton :to="`/course/${row.id}/edit`" />
          <DeleteButton
            class="text-xs"
            :confirm-message="`Are you sure you want to delete ${row.title}?`"
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

const categoryFilterOptions = [
  { value: "Tajweed", label: "Tajweed" },
  { value: "Memorization", label: "Memorization" },
  { value: "Recitation", label: "Recitation" },
  { value: "Arabic", label: "Arabic" },
  { value: "Beginners", label: "Beginners" },
  { value: "Advanced", label: "Advanced" },
];

const selectedCategory = ref<string | null>(null);

const columns: TableColumn[] = [
  { key: "title", label: "Title", sortable: true },
  { key: "instructor", label: "Instructor", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "actions", label: "Actions" },
];

const allRows = ref([
  { id: 1, title: "Tajweed Foundations", instructor: "Ustadh Hamza", category: "Tajweed" },
  { id: 2, title: "Memorize Juz Amma", instructor: "Ustadhah Maryam", category: "Memorization" },
  { id: 3, title: "Arabic Reading Basics", instructor: "Ustadh Khalid", category: "Arabic" },
  { id: 4, title: "Advanced Recitation", instructor: "Ustadhah Sara", category: "Recitation" },
  { id: 5, title: "Beginner Quran Course", instructor: "Ustadh Bilal", category: "Beginners" },
  { id: 6, title: "Intensive Hifz Program", instructor: "Ustadhah Amina", category: "Advanced" },
]);

const filteredRows = computed(() => {
  const searchValue = query.value.trim().toLowerCase();
  const categoryValue = selectedCategory.value?.toLowerCase() ?? "";

  return allRows.value.filter((row) => {
    const matchesSearch = searchValue
      ? [row.title, row.instructor, row.category]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      : true;

    const matchesCategory = categoryValue ? row.category.toLowerCase() === categoryValue : true;

    return matchesSearch && matchesCategory;
  });
});

const pageSizeNumber = computed(() => Number(pageSize.value ?? 10));

const emptyStateMessage = computed(() => {
  if (!filteredRows.value.length) {
    return query.value
      ? `No courses found for "${query.value}"`
      : "No data available";
  }
  return "No data available";
});

watch(query, () => {
  page.value = 1;
});

watch(selectedCategory, () => {
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
    placeholder: "Search courses by title, instructor, or category",
    emptyText: "Try typing part of a course title like Tajweed or a category like Arabic",
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


