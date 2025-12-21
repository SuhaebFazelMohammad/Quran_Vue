<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <Heading title="Users" link="/admin/users/create" buttonText="Add User" />
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
        <div class="flex items-center gap-3">
          <SelectFilter
            :options="roleFilterOptions"
            v-model="selectedRole"
            :clearable="true"
            :searchable="false"
            placeholder="Filter by role"
            icon="heroicons:user-group"
          />
          <SelectFilter
            :options="genderFilterOptions"
            v-model="selectedGender"
            :clearable="true"
            :searchable="false"
            placeholder="Filter by gender"
            icon="heroicons:user-20-solid"
          />
          <SelectFilter
            :options="deletedFilterOptions"
            v-model="selectedDeletedStatus"
            :clearable="true"
            :searchable="false"
            placeholder="Filter by status"
            icon="heroicons:trash-20-solid"
          />
        </div>
      </div>
    </div>

    <div v-if="successMessage" class="animate-fade-in">
      <SuccessMessage
        :title="successMessage"
        message="The user has been deleted successfully."
      />
    </div>

    <div v-if="errorMessage" class="animate-fade-in">
      <ErrorMessage
        :title="errorMessage"
        message="Failed to delete the user. Please try again."
      />
    </div>

    <Table
      :columns="columns"
      :rows="filteredRows"
      :loading="loading"
      :pageSize="pageSizeNumber"
      :total="totalUsers"
      :empty-text="emptyStateMessage"
      v-model:modelValuePage="page"
      @sort-change="onSortChange"
    >
      <template #cell-role="{ row }">
        <span class="inline-flex items-center gap-2">
          <span
            class="h-2 w-2 rounded-full"
            :class="row.role === 'Admin' ? 'bg-emerald-500' : 'bg-amber-400'"
          ></span>
          {{ row.role }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <ShowButton :to="`/admin/users/${row.id}`" />
          <EditButton :to="`/admin/users/${row.id}/edit`" />
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
import { useSearchStore } from "../../../stores/search";
import DeleteButton from "../../../components/buttons/delete.vue";
import EditButton from "../../../components/buttons/edit.vue";
import ShowButton from "../../../components/buttons/show.vue";
import SelectFilter from "../../../components/input/selectFilter.vue";
import Heading from "../../../components/heading.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { getUsers, deleteUser, type User } from "../../../api/users";

const loading = ref(false);
const page = ref(1);
const pageSize = ref<number | null>(10);
const searchDebounceId = ref<number | null>(null);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const messageTimeoutId = ref<number | null>(null);

const searchStore = useSearchStore();
const { query } = storeToRefs(searchStore);

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

const roleFilterOptions = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Moderator" },
  { value: "3", label: "User" },
];

const selectedRole = ref<string | null>(null);
const selectedGender = ref<string | null>(null);
const selectedDeletedStatus = ref<string | null>(null);

const roleLabelById: Record<string, string> = {
  "1": "Admin",
  "2": "Moderator",
  "3": "User",
};

const genderFilterOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

const deletedFilterOptions = [
  { value: "", label: "Active" },
  { value: "deleted", label: "Deleted" },
];

const columns: TableColumn[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "actions", label: "Actions" },
];

const allRows = ref<User[]>([]);
const totalUsers = ref(0);

async function loadUsers() {
  try {
    loading.value = true;
    const response = await getUsers({
      page: page.value,
      show: pageSize.value ?? undefined,
      search: query.value || undefined,
      role: selectedRole.value || undefined,
      gender: selectedGender.value || undefined,
      deleted_at: selectedDeletedStatus.value || undefined,
      // city: selectedCity.value || undefined, // enable when you add a city filter input
    });

    // PaginatedResponse<User> is already typed in the API layer
    allRows.value = response.data;
    totalUsers.value = response.total;
  } catch (error) {
    console.error("Failed to load users", error);
    allRows.value = [];
  } finally {
    loading.value = false;
  }
}

const filteredRows = computed(() => {
  const searchValue = query.value.trim().toLowerCase();

  return allRows.value
    .map((user) => {
      const name =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.email;

      // Backend may return role as numeric ID (1,2,3) or string label; normalize
      const rawRole: string | number | undefined =
        (user as any).role_id ?? (user as any).role;
      const roleId = rawRole != null ? String(rawRole) : "3"; // default to "User"
      const role = roleLabelById[roleId] ?? "User";

      // If a role filter is selected, respect it here as well
      if (selectedRole.value && selectedRole.value !== roleId) {
        return null;
      }

      const city = user.city ?? "";

      return {
        id: user.id,
        name,
        email: user.email,
        role,
        city,
      };
    })
    .filter((row) => {
      if (!row) return false;
      const matchesSearch = searchValue
        ? [row.name, row.email, row.role, row.city]
            .join(" ")
            .toLowerCase()
            .includes(searchValue)
        : true;

      return matchesSearch;
    }) as Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    city: string;
  }>;
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
  // Reset to first page whenever search term changes
  page.value = 1;

  // Debounce backend search to avoid too many requests while typing
  if (searchDebounceId.value !== null) {
    clearTimeout(searchDebounceId.value);
  }
  searchDebounceId.value = window.setTimeout(() => {
    loadUsers();
  }, 300);
});

watch(selectedRole, () => {
  page.value = 1;
  // Also refetch from backend so role filter is applied server-side if supported
  loadUsers();
});

watch(selectedGender, () => {
  page.value = 1;
  loadUsers();
});

watch(selectedDeletedStatus, () => {
  page.value = 1;
  loadUsers();
});

watch(pageSize, () => {
  page.value = 1;
  loadUsers();
});

watch(page, () => {
  // When user clicks pagination component, fetch that page from backend
  loadUsers();
});

onMounted(() => {
  searchStore.setContext({
    placeholder: "Search users by name, email, or role",
    emptyText: "Try typing part of a name like Ali or a role like Admin",
  });
  searchStore.clearQuery();
  loadUsers();
});

onBeforeUnmount(() => {
  searchStore.resetContext();
  searchStore.clearQuery();
  clearMessages();
});

function onSortChange(payload: { key: string; direction: "asc" | "desc" }) {
  // Example: here you could fetch server-side with sort params
  // For demo, we do nothing; table handles local sorting
  console.log("sort-change", payload);
}

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

async function handleDelete(row: { id: number; name: string }) {
  try {
    await deleteUser(row.id);
    // Reload users list to ensure UI is in sync with backend
    await loadUsers();
    showSuccessMessage("User deleted successfully");
  } catch (error: any) {
    console.error("Failed to delete user", error);
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete user";
    showErrorMessage(errorMsg);
  }
}
</script>
