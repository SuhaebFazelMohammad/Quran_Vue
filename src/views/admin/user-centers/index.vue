<template>
  <div class="space-y-6">
    <Heading
      title="User Centers"
      link="/admin/user-centers/create"
      buttonText="Add User Center"
    />

    <SuccessMessage v-if="successMessage" :title="successMessage" />

    <Table
      :columns="columns"
      :rows="rows"
      :pageSize="10"
      :total="rows.length"
      empty-text="No user-center mappings available"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton :to="`/admin/user-centers/${row.id}/edit`" />
          <DeleteButton
            :confirm-message="`Delete user-center mapping #${row.id}?`"
            @confirm="handleDelete(row.id)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Table, { type TableColumn } from "../../../components/table.vue";
import Heading from "../../../components/heading.vue";
import EditButton from "../../../components/buttons/edit.vue";
import DeleteButton from "../../../components/buttons/delete.vue";
import SuccessMessage from "../../../components/message/success.vue";
import { deleteUserCenter, getUserCenters } from "../../../data/centers-local";

type UserCenterRow = {
  id: number;
  quran_center_id: number;
  user_id: number;
};

const columns: TableColumn[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "quran_center_id", label: "Quran Center ID", sortable: true },
  { key: "user_id", label: "User ID", sortable: true },
  { key: "actions", label: "Actions" },
];

const rows = ref<UserCenterRow[]>([]);
const successMessage = ref<string | null>(null);

function loadData() {
  rows.value = getUserCenters();
}

function handleDelete(id: number) {
  deleteUserCenter(id);
  successMessage.value = "User-center mapping deleted successfully";
  loadData();
}

onMounted(() => {
  loadData();
});
</script>
