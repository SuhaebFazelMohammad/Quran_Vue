<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <Heading
        title="Course Types"
        link="/admin/course-type/create"
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
      </div>
    </div>

    <div v-if="successMessage" class="animate-fade-in">
      <SuccessMessage
        :title="successMessage"
        message="The operation completed successfully."
      />
    </div>

    <div v-if="errorMessage" class="animate-fade-in">
      <ErrorMessage :title="errorMessage" message="Please try again." />
    </div>

    <Table
      :columns="columns"
      :rows="filteredRows"
      :loading="loading"
      :pageSize="pageSizeNumber"
      :total="totalTypeCourses"
      :empty-text="emptyStateMessage"
      v-model:modelValuePage="page"
      @sort-change="onSortChange"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton :to="`/admin/course-type/${row.id}/edit`" />
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
import DeleteButton from "../../../components/buttons/delete.vue";
import EditButton from "../../../components/buttons/edit.vue";
import { useSearchStore } from "../../../stores/search";
import Heading from "../../../components/heading.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import {
  getTypeCourses,
  deleteTypeCourse,
  type TypeCourse,
} from "../../../api/type-courses";

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

const columns: TableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "actions", label: "Actions" },
];

const allRows = ref<TypeCourse[]>([]);
const totalTypeCourses = ref(0);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const messageTimeoutId = ref<number | null>(null);

const filteredRows = computed(() => {
  const searchValue = query.value.trim().toLowerCase();

  return allRows.value
    .map((typeCourse) => ({
      id: typeCourse.id,
      name: typeCourse.name,
    }))
    .filter((row) => {
      const matchesSearch = searchValue
        ? row.name.toLowerCase().includes(searchValue)
        : true;

      return matchesSearch;
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

const searchDebounceId = ref<number | null>(null);

async function loadTypeCourses() {
  try {
    loading.value = true;
    const response = await getTypeCourses({
      page: page.value,
      show: pageSize.value ?? undefined,
      search: query.value || undefined,
    });

    allRows.value = response.data;
    totalTypeCourses.value = response.total;
  } catch (error) {
    console.error("Failed to load type courses", error);
    allRows.value = [];
  } finally {
    loading.value = false;
  }
}

watch(query, () => {
  page.value = 1;

  if (searchDebounceId.value !== null) {
    clearTimeout(searchDebounceId.value);
  }
  searchDebounceId.value = window.setTimeout(() => {
    loadTypeCourses();
  }, 300);
});

watch(pageSize, () => {
  page.value = 1;
  loadTypeCourses();
});

watch(page, () => {
  loadTypeCourses();
});

function clearMessages() {
  successMessage.value = null;
  errorMessage.value = null;
  if (messageTimeoutId.value !== null) {
    clearTimeout(messageTimeoutId.value);
    messageTimeoutId.value = null;
  }
}

function showSuccessMessage(message: string) {
  clearMessages();
  successMessage.value = message;
  messageTimeoutId.value = window.setTimeout(() => {
    successMessage.value = null;
    messageTimeoutId.value = null;
  }, 5000);
}

function showErrorMessage(message: string) {
  clearMessages();
  errorMessage.value = message;
  messageTimeoutId.value = window.setTimeout(() => {
    errorMessage.value = null;
    messageTimeoutId.value = null;
  }, 5000);
}

onMounted(() => {
  searchStore.setContext({
    placeholder: "Search course types by name",
    emptyText: "Try searching for a course type name",
  });
  searchStore.clearQuery();
  loadTypeCourses();
});

onBeforeUnmount(() => {
  searchStore.resetContext();
  searchStore.clearQuery();
  clearMessages();
});

function onSortChange(payload: { key: string; direction: "asc" | "desc" }) {
  console.log("sort-change", payload);
}

async function handleDelete(row: { id: number; name: string }) {
  try {
    await deleteTypeCourse(row.id);
    await loadTypeCourses();
    showSuccessMessage("Type course deleted successfully");
  } catch (error: any) {
    console.error("Failed to delete type course", error);
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete type course";
    showErrorMessage(errorMsg);
  }
}
</script>
