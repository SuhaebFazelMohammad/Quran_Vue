<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Tafsir
        </h1>

        <div class="flex items-center gap-2">
          <div class="relative" ref="importMenuRef">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-200"
              @click="isImportMenuOpen = !isImportMenuOpen"
            >
              <Icon icon="heroicons:arrow-down-tray-20-solid" class="h-4 w-4" />
              <span>Import</span>
              <Icon icon="heroicons:chevron-down-20-solid" class="h-4 w-4" />
            </button>

            <div
              v-if="isImportMenuOpen"
              class="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <button
                type="button"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="handleDownloadTemplate"
              >
                <Icon icon="heroicons:document-arrow-down-20-solid" class="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                type="button"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="openFileDialog"
              >
                <Icon icon="heroicons:arrow-up-tray-20-solid" class="h-4 w-4" />
                <span>Import</span>
              </button>
            </div>
          </div>

          <RouterLink
            to="/admin/tafsir/create"
            class="glass-button inline-flex items-center gap-2 bg-amber-500/95 px-4 py-2 text-sm font-medium shadow-amber-500/20"
          >
            <span>Add Tafsir</span>
            <Icon icon="heroicons:plus-20-solid" class="h-4 w-4" />
          </RouterLink>
        </div>
      </div>

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
    </div>

    <div v-if="successMessage" class="animate-fade-in">
      <SuccessMessage :title="successMessage" message="Static mode for now." />
    </div>

    <Table
      :columns="columns"
      :rows="tafsirRows"
      :pageSize="pageSizeNumber"
      :total="tafsirRows.length"
      v-model:modelValuePage="page"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <EditButton :to="`/admin/tafsir/${row.id}/edit`" />
          <DeleteButton
            :confirm-message="`Delete tafsir: ${row.title}?`"
            @confirm="handleDelete(row.id)"
          />
        </div>
      </template>
    </Table>

    <input
      ref="fileInputRef"
      type="file"
      accept=".csv,.xlsx,.xls,.json"
      class="hidden"
      @change="handleImportFile"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import Table, { type TableColumn } from "../../../components/table.vue";
import Select from "../../../components/input/select.vue";
import EditButton from "../../../components/buttons/edit.vue";
import DeleteButton from "../../../components/buttons/delete.vue";
import SuccessMessage from "../../../components/message/success.vue";

type TafsirRow = {
  id: number;
  title: string;
  language: string;
  source: string;
  status: string;
};

const page = ref(1);
const pageSize = ref<number | null>(10);
const successMessage = ref<string | null>(null);
const isImportMenuOpen = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const importMenuRef = ref<HTMLElement | null>(null);

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

const columns: TableColumn[] = [
  { key: "title", label: "Tafsir Title", sortable: true },
  { key: "language", label: "Language", sortable: true },
  { key: "source", label: "Source", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "actions", label: "Actions" },
];

const tafsirRows = ref<TafsirRow[]>([
  {
    id: 1,
    title: "Tafsir Ibn Kathir (Sample)",
    language: "Arabic",
    source: "Internal",
    status: "Published",
  },
  {
    id: 2,
    title: "Tafsir As-Sa'di (Sample)",
    language: "Arabic",
    source: "CSV Import",
    status: "Draft",
  },
  {
    id: 3,
    title: "English Tafsir Notes (Sample)",
    language: "English",
    source: "Manual",
    status: "Published",
  },
]);

const pageSizeNumber = computed(() => Number(pageSize.value ?? 10));

function showMessage(message: string) {
  successMessage.value = message;
  window.setTimeout(() => {
    successMessage.value = null;
  }, 2500);
}

function handleDelete(id: number) {
  tafsirRows.value = tafsirRows.value.filter((item) => item.id !== id);
  showMessage("Tafsir deleted successfully");
}

function handleDownloadTemplate() {
  isImportMenuOpen.value = false;
  showMessage("Template download clicked");
}

function openFileDialog() {
  isImportMenuOpen.value = false;
  fileInputRef.value?.click();
}

function handleImportFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileName = input.files?.[0]?.name;
  if (fileName) {
    showMessage(`Imported file selected: ${fileName}`);
  }
  input.value = "";
}

function onDocumentClick(event: MouseEvent) {
  if (!isImportMenuOpen.value) return;
  const target = event.target as Node;
  if (importMenuRef.value && !importMenuRef.value.contains(target)) {
    isImportMenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
});
</script>
