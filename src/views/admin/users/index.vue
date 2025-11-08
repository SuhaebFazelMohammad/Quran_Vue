<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-y-3">
      <h1 class="text-base font-semibold text-slate-800">Users</h1>
      <div class="flex justify-between items-center gap-3">
        <div class="flex items-center gap-2 text-sm text-slate-600">
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
        <RouterLink
          to="/users/create"
          class="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px"
        >
          Add User
        </RouterLink>
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
      <!-- Example: custom role cell with dot -->
      <template #cell-role="{ row }">
        <span class="inline-flex items-center gap-2">
          <span
            class="w-2 h-2 rounded-full"
            :class="row.role === 'Admin' ? 'bg-amber-500' : 'bg-slate-300'"
          ></span>
          {{ row.role }}
        </span>
      </template>

      <!-- Example: custom actions cell -->
      <template #cell-actions>
        <div class="flex items-center gap-2">
          <button
            class="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            class="px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50"
          >
            Delete
          </button>
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

const columns: TableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "actions", label: "Actions" },
];

const allRows = ref([
  { id: 1, name: "Ali", email: "ali@example.com", role: "Admin" },
  { id: 2, name: "Fatima", email: "fatima@example.com", role: "User" },
  { id: 3, name: "Aisha", email: "aisha@example.com", role: "User" },
  { id: 4, name: "Umar", email: "umar@example.com", role: "Admin" },
  { id: 5, name: "Bilal", email: "bilal@example.com", role: "User" },
  { id: 6, name: "Zainab", email: "zainab@example.com", role: "User" },
  { id: 7, name: "Ali", email: "ali@example.com", role: "Admin" },
  { id: 8, name: "Fatima", email: "fatima@example.com", role: "User" },
  { id: 9, name: "Aisha", email: "aisha@example.com", role: "User" },
  { id: 10, name: "Umar", email: "umar@example.com", role: "Admin" },
  { id: 11, name: "Bilal", email: "bilal@example.com", role: "User" },
  { id: 12, name: "Zainab", email: "zainab@example.com", role: "User" },
  { id: 13, name: "Ali", email: "ali@example.com", role: "Admin" },
  { id: 14, name: "Fatima", email: "fatima@example.com", role: "User" },
  { id: 15, name: "Aisha", email: "aisha@example.com", role: "User" },
  { id: 16, name: "Umar", email: "umar@example.com", role: "Admin" },
  { id: 17, name: "Bilal", email: "bilal@example.com", role: "User" },
  { id: 18, name: "Zainab", email: "zainab@example.com", role: "User" },
  { id: 19, name: "Ali", email: "ali@example.com", role: "Admin" },
  { id: 20, name: "Fatima", email: "fatima@example.com", role: "User" },
  { id: 21, name: "Aisha", email: "aisha@example.com", role: "User" },
  { id: 22, name: "Umar", email: "umar@example.com", role: "Admin" },
  { id: 23, name: "Bilal", email: "bilal@example.com", role: "User" },
  { id: 24, name: "Zainab", email: "zainab@example.com", role: "User" },
]);

const filteredRows = computed(() => {
  const value = query.value.trim().toLowerCase();
  if (!value) {
    return allRows.value;
  }
  return allRows.value.filter((row) =>
    [row.name, row.email, row.role].join(" ").toLowerCase().includes(value)
  );
});

const pageSizeNumber = computed(() => Number(pageSize.value ?? 10));

const emptyStateMessage = computed(() => {
  if (!filteredRows.value.length) {
    return query.value
      ? `No users found for "${query.value}"`
      : "No data available";
  }
  return "No data available";
});

watch(query, () => {
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
    placeholder: "Search users by name, email, or role",
    emptyText: "Try typing part of a name like Ali or a role like Admin",
  });
  searchStore.clearQuery();
});

onBeforeUnmount(() => {
  searchStore.resetContext();
  searchStore.clearQuery();
});

function onSortChange(payload: { key: string; direction: "asc" | "desc" }) {
  // Example: here you could fetch server-side with sort params
  // For demo, we do nothing; table handles local sorting
  console.log("sort-change", payload);
}
</script>
