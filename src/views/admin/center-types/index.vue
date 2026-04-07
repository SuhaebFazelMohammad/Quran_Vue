<template>
  <div class="space-y-6">
    <Heading
      title="Center Types"
      link="/admin/center-types/create"
      buttonText="Add Center Type"
    />

    <SuccessMessage v-if="successMessage" :title="successMessage" />

    <Table
      :columns="columns"
      :rows="rows"
      :pageSize="10"
      :total="rows.length"
      empty-text="No center types available"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton :to="`/admin/center-types/${row.id}/edit`" />
          <DeleteButton
            :confirm-message="`Delete center type ${row.name}?`"
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
import { deleteCenterType, getCenterTypes } from "../../../data/centers-local";

type CenterTypeRow = {
  id: number;
  name: string;
  created_at: string;
};

const columns: TableColumn[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "created_at", label: "Created At", sortable: true },
  { key: "actions", label: "Actions" },
];

const rows = ref<CenterTypeRow[]>([]);
const successMessage = ref<string | null>(null);

function loadData() {
  rows.value = getCenterTypes();
}

function handleDelete(id: number) {
  deleteCenterType(id);
  successMessage.value = "Center type deleted successfully";
  loadData();
}

onMounted(() => {
  loadData();
});
</script>
