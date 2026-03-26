<template>
  <div class="space-y-6">
    <Heading title="Permissions & Roles" link="/admin/dashboard" buttonText="Back" />

    <!-- Tab bar -->
    <section
      class="surface-card flex flex-wrap items-center gap-2 border border-slate-200/70 dark:border-slate-800/70"
    >
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition"
        :class="
          activeTab === tab.key
            ? 'bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        "
        @click="activeTab = tab.key"
      >
        <Icon :icon="tab.icon" class="h-4 w-4" />
        <span>{{ tab.label }}</span>
      </button>
    </section>

    <!-- ==================== ROLES TAB ==================== -->
    <section v-if="activeTab === 'roles'" class="surface-card space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Roles</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            All roles available in the system.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300"
          :class="showRoleForm ? 'border-red-200 text-red-500 hover:border-red-300 hover:text-red-600 dark:border-red-700 dark:text-red-400' : ''"
          @click="showRoleForm = !showRoleForm"
        >
          <Icon
            :icon="showRoleForm ? 'heroicons:x-mark-20-solid' : 'heroicons:plus-20-solid'"
            class="h-4 w-4"
          />
          {{ showRoleForm ? "Cancel" : "Add Role" }}
        </button>
      </div>

      <!-- Add Role form -->
      <form
        v-if="showRoleForm"
        class="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-400/20 dark:bg-amber-400/5"
        @submit.prevent="submitRoleForm"
      >
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          New Role
        </p>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-300">
              Role Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newRole.name"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="e.g. editor"
              autofocus
            />
            <p v-if="roleError" class="text-xs text-red-500">{{ roleError }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-300">Guard Name</label>
            <input
              v-model="newRole.guard_name"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="web"
            />
          </div>
          <div class="flex items-end gap-2">
            <button
              type="submit"
              class="glass-button flex-1 bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
            >
              Save Role
            </button>
          </div>
        </div>
      </form>

      <Table :columns="roleColumns" :rows="roles" :pageSize="8" :total="roles.length">
        <template #cell-name="{ row }">
          <span
            class="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300"
          >
            <Icon icon="heroicons:shield-check-20-solid" class="h-3 w-3" />
            {{ row.name }}
          </span>
        </template>
        <template #cell-guard_name="{ row }">
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.guard_name }}</span>
        </template>
        <template #cell-actions="{ row }">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-lg border border-red-200/60 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400"
            @click="deleteRole(row.id)"
          >
            <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
            Delete
          </button>
        </template>
      </Table>
    </section>

    <!-- ==================== PERMISSIONS TAB ==================== -->
    <section v-else-if="activeTab === 'permissions'" class="surface-card space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">Permissions</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Fine-grained access control keys.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300"
          :class="showPermissionForm ? 'border-red-200 text-red-500 hover:border-red-300 hover:text-red-600 dark:border-red-700 dark:text-red-400' : ''"
          @click="showPermissionForm = !showPermissionForm"
        >
          <Icon
            :icon="showPermissionForm ? 'heroicons:x-mark-20-solid' : 'heroicons:plus-20-solid'"
            class="h-4 w-4"
          />
          {{ showPermissionForm ? "Cancel" : "Add Permission" }}
        </button>
      </div>

      <!-- Add Permission form -->
      <form
        v-if="showPermissionForm"
        class="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-400/20 dark:bg-amber-400/5"
        @submit.prevent="submitPermissionForm"
      >
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          New Permission
        </p>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-300">
              Permission Key <span class="text-red-500">*</span>
            </label>
            <input
              v-model="newPermission.name"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="e.g. users.view"
              autofocus
            />
            <p v-if="permissionError" class="text-xs text-red-500">{{ permissionError }}</p>
          </div>
          <div class="space-y-1.5">
            <label class="text-xs font-medium text-slate-600 dark:text-slate-300">
              Label (Display)
            </label>
            <input
              v-model="newPermission.label"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:focus:border-amber-400"
              placeholder="e.g. View Users"
            />
          </div>
          <div class="flex items-end">
            <button
              type="submit"
              class="glass-button w-full bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
            >
              Save Permission
            </button>
          </div>
        </div>
      </form>

      <Table
        :columns="permissionColumns"
        :rows="permissions"
        :pageSize="8"
        :total="permissions.length"
      >
        <template #cell-label="{ row }">
          <span class="text-sm text-slate-700 dark:text-slate-200">{{ row.label }}</span>
        </template>
        <template #cell-name="{ row }">
          <code
            class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {{ row.name }}
          </code>
        </template>
        <template #cell-guard_name="{ row }">
          <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.guard_name }}</span>
        </template>
        <template #cell-actions="{ row }">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-lg border border-red-200/60 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-400"
            @click="deletePermission(row.id)"
          >
            <Icon icon="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
            Delete
          </button>
        </template>
      </Table>
    </section>

    <!-- ==================== ASSIGN TAB ==================== -->
    <section v-else class="surface-card space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Assign Access to User
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Select a user, assign a role, and pick permissions.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300"
          :class="showAssignmentForm ? 'border-red-200 text-red-500 hover:border-red-300 hover:text-red-600 dark:border-red-700 dark:text-red-400' : ''"
          @click="showAssignmentForm = !showAssignmentForm"
        >
          <Icon
            :icon="showAssignmentForm ? 'heroicons:x-mark-20-solid' : 'heroicons:plus-20-solid'"
            class="h-4 w-4"
          />
          {{ showAssignmentForm ? "Cancel" : "Assign User" }}
        </button>
      </div>

      <!-- Assignment form -->
      <form
        v-if="showAssignmentForm"
        class="space-y-5 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-400/20 dark:bg-amber-400/5"
        @submit.prevent="saveAssignment"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
          New Assignment
        </p>

        <div class="grid gap-5 md:grid-cols-2">
          <!-- User -->
          <Select
            id="user"
            v-model="assignment.userId"
            :options="userOptions"
            label="User"
            placeholder="Select user"
            icon-left="heroicons:user-20-solid"
            :clearable="false"
            :searchable="true"
            required
          />
          <!-- Role -->
          <Select
            id="role"
            v-model="assignment.role"
            :options="roleSelectOptions"
            label="Role"
            placeholder="Select role"
            icon-left="heroicons:shield-check-20-solid"
            :clearable="false"
            :searchable="false"
            required
          />
        </div>

        <!-- Permissions as checkboxes -->
        <div class="space-y-2">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-300">
            Permissions
            <span class="ml-1 text-slate-400">(select one or more)</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="perm in permissions"
              :key="perm.id"
              class="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition select-none"
              :class="
                assignment.permissions.includes(perm.name)
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              "
            >
              <input
                type="checkbox"
                class="h-3.5 w-3.5 rounded accent-amber-500"
                :value="perm.name"
                v-model="assignment.permissions"
              />
              <span>{{ perm.label || perm.name }}</span>
              <code class="rounded bg-slate-100 px-1 py-0.5 text-slate-400 dark:bg-slate-800 text-[10px]">
                {{ perm.name }}
              </code>
            </label>
          </div>
        </div>

        <div class="flex items-center gap-3 border-t border-amber-200/60 pt-4 dark:border-amber-400/20">
          <button
            type="submit"
            class="glass-button bg-amber-500/95 px-5 py-2.5 text-sm font-semibold shadow-amber-500/20"
          >
            Save Assignment
          </button>
          <p class="text-xs text-slate-400 dark:text-slate-500">
            {{ assignment.permissions.length }} permission(s) selected
          </p>
        </div>
      </form>

      <!-- Assignments table -->
      <Table
        :columns="assignmentColumns"
        :rows="assignments"
        :pageSize="8"
        :total="assignments.length"
      >
        <template #cell-role="{ row }">
          <span
            class="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300"
          >
            <Icon icon="heroicons:shield-check-20-solid" class="h-3 w-3" />
            {{ row.role }}
          </span>
        </template>
        <template #cell-permissions="{ row }">
          <div class="flex flex-wrap gap-1">
            <span
              v-for="p in row.permissions"
              :key="p"
              class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {{ p }}
            </span>
          </div>
        </template>
      </Table>
    </section>

    <SuccessMessage
      v-if="successMessage"
      :title="successMessage"
      message="Static UI ready. Connect it with Laravel Spatie API next."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import Heading from "../../../components/heading.vue";
import Table, { type TableColumn } from "../../../components/table.vue";
import Select from "../../../components/input/select.vue";
import SuccessMessage from "../../../components/message/success.vue";

type RoleRow = { id: number; name: string; guard_name: string };
type PermissionRow = { id: number; name: string; label: string; guard_name: string };
type AssignmentRow = {
  id: number;
  user_label: string;
  role: string;
  permissions: string[];
};

const successMessage = ref<string | null>(null);
const activeTab = ref<"roles" | "permissions" | "assign">("roles");
const showRoleForm = ref(false);
const showPermissionForm = ref(false);
const showAssignmentForm = ref(false);
const roleError = ref("");
const permissionError = ref("");

const tabs = [
  { key: "roles" as const, label: "Roles", icon: "heroicons:shield-check-20-solid" },
  { key: "permissions" as const, label: "Permissions", icon: "heroicons:key-20-solid" },
  { key: "assign" as const, label: "Assign User Access", icon: "heroicons:user-plus-20-solid" },
];

const roles = ref<RoleRow[]>([
  { id: 1, name: "admin", guard_name: "web" },
  { id: 2, name: "editor", guard_name: "web" },
  { id: 3, name: "student", guard_name: "web" },
]);

const permissions = ref<PermissionRow[]>([
  { id: 1, name: "users.view", label: "View Users", guard_name: "web" },
  { id: 2, name: "users.edit", label: "Edit Users", guard_name: "web" },
  { id: 3, name: "tafsir.manage", label: "Manage Tafsir", guard_name: "web" },
]);

const assignments = ref<AssignmentRow[]>([
  {
    id: 1,
    user_label: "User #1 - Admin",
    role: "admin",
    permissions: ["users.view", "users.edit"],
  },
]);

const roleColumns: TableColumn[] = [
  { key: "name", label: "Role Name", sortable: true },
  { key: "guard_name", label: "Guard", sortable: true },
  { key: "actions", label: "Actions" },
];

const permissionColumns: TableColumn[] = [
  { key: "label", label: "Display Name", sortable: true },
  { key: "name", label: "Key", sortable: true },
  { key: "guard_name", label: "Guard", sortable: true },
  { key: "actions", label: "Actions" },
];

const assignmentColumns: TableColumn[] = [
  { key: "user_label", label: "User", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "permissions", label: "Permissions" },
];

const newRole = ref({ name: "", guard_name: "web" });
const newPermission = ref({ name: "", label: "", guard_name: "web" });
const assignment = ref({
  userId: "" as string,
  role: "" as string,
  permissions: [] as string[],
});

const userOptions = [
  { value: "1", label: "User #1 - Admin" },
  { value: "2", label: "User #2 - Editor" },
  { value: "3", label: "User #3 - Student" },
];

// Build role select options dynamically from roles list
const roleSelectOptions = computed(() =>
  roles.value.map((r) => ({ value: r.name, label: r.name }))
);

function setMessage(message: string) {
  successMessage.value = message;
  window.setTimeout(() => {
    successMessage.value = null;
  }, 2500);
}

function submitRoleForm() {
  roleError.value = "";
  const name = newRole.value.name.trim();
  if (!name) {
    roleError.value = "Role name is required";
    return;
  }
  if (roles.value.some((r) => r.name === name)) {
    roleError.value = "This role already exists";
    return;
  }

  const nextId = roles.value.length ? Math.max(...roles.value.map((r) => r.id)) + 1 : 1;
  roles.value.push({ id: nextId, name, guard_name: newRole.value.guard_name || "web" });
  newRole.value = { name: "", guard_name: "web" };
  showRoleForm.value = false;
  setMessage("Role added successfully");
}

function deleteRole(id: number) {
  roles.value = roles.value.filter((r) => r.id !== id);
  setMessage("Role deleted");
}

function submitPermissionForm() {
  permissionError.value = "";
  const name = newPermission.value.name.trim();
  if (!name) {
    permissionError.value = "Permission key is required";
    return;
  }
  if (permissions.value.some((p) => p.name === name)) {
    permissionError.value = "This permission key already exists";
    return;
  }

  const nextId = permissions.value.length
    ? Math.max(...permissions.value.map((p) => p.id)) + 1
    : 1;
  permissions.value.push({
    id: nextId,
    name,
    label: newPermission.value.label.trim() || name,
    guard_name: newPermission.value.guard_name || "web",
  });
  newPermission.value = { name: "", label: "", guard_name: "web" };
  showPermissionForm.value = false;
  setMessage("Permission added successfully");
}

function deletePermission(id: number) {
  permissions.value = permissions.value.filter((p) => p.id !== id);
  setMessage("Permission deleted");
}

function saveAssignment() {
  const selectedUser = userOptions.find((u) => u.value === assignment.value.userId);
  const nextId = assignments.value.length
    ? Math.max(...assignments.value.map((a) => a.id)) + 1
    : 1;

  assignments.value.unshift({
    id: nextId,
    user_label: selectedUser?.label || `User #${assignment.value.userId}`,
    role: assignment.value.role,
    permissions: [...assignment.value.permissions],
  });

  assignment.value = { userId: "", role: "", permissions: [] };
  showAssignmentForm.value = false;
  setMessage("Access assigned to user successfully");
}
</script>
