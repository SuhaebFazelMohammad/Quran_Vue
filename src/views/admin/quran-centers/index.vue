<template>
  <div class="space-y-6">
    <Heading
      title="Quran Centers"
      link="/admin/quran-centers/create"
      buttonText="Add Quran Center"
    />

    <SuccessMessage v-if="successMessage" :title="successMessage" />

    <Table
      :columns="columns"
      :rows="rows"
      :pageSize="8"
      :total="rows.length"
      empty-text="No quran centers available"
    >
      <template #cell-approval="{ row }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="
            row.approval
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
          "
        >
          {{ row.approval ? "Approved" : "Pending" }}
        </span>
      </template>
      <template #cell-softdelete="{ row }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="
            row.softdelete
              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300'
          "
        >
          {{ row.softdelete ? "Yes" : "No" }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton :to="`/admin/quran-centers/${row.id}/edit`" />
          <DeleteButton
            :confirm-message="`Delete quran center ${row.name}?`"
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
import { deleteQuranCenter, getQuranCenters } from "../../../data/centers-local";

type QuranCenterRow = {
  id: number;
  center_type_id: number;
  city: string;
  name: string;
  created_by: number;
  location: string;
  approval: boolean;
  approval_by: number | null;
  approval_at: string | null;
  softdelete: boolean;
  created_at: string;
};

const columns: TableColumn[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "city", label: "City", sortable: true },
  { key: "center_type_id", label: "Type ID", sortable: true },
  { key: "created_by", label: "Created By", sortable: true },
  { key: "approval", label: "Approval", sortable: true },
  { key: "approval_by", label: "Approval By", sortable: true },
  { key: "approval_at", label: "Approval At", sortable: true },
  { key: "softdelete", label: "Soft Delete", sortable: true },
  { key: "created_at", label: "Created At", sortable: true },
  { key: "actions", label: "Actions" },
];

const rows = ref<QuranCenterRow[]>([]);
const successMessage = ref<string | null>(null);

function loadData() {
  rows.value = getQuranCenters();
}

function handleDelete(id: number) {
  deleteQuranCenter(id);
  successMessage.value = "Quran center deleted successfully";
  loadData();
}

onMounted(() => {
  loadData();
});
</script>
