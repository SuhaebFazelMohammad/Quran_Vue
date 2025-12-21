<template>
  <div class="space-y-6">
    <div class="space-y-5">
      <Heading
        title="Courses"
        link="/admin/course/create"
        buttonText="Add Course"
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
          :options="typeFilterOptions"
          v-model="selectedType"
          :clearable="true"
          :searchable="false"
          placeholder="Filter by type"
          icon="heroicons:tag-20-solid"
        />
      </div>
    </div>

    <div v-if="successMessage" class="animate-fade-in">
      <SuccessMessage
        :title="successMessage"
        message="The course has been deleted successfully."
      />
    </div>

    <div v-if="errorMessage" class="animate-fade-in">
      <ErrorMessage
        :title="errorMessage"
        message="Failed to delete the course. Please try again."
      />
    </div>

    <Table
      :columns="columns"
      :rows="filteredRows"
      :loading="loading"
      :pageSize="pageSizeNumber"
      :total="totalCourses"
      :empty-text="emptyStateMessage"
      v-model:modelValuePage="page"
      @sort-change="onSortChange"
    >
      <template #cell-name="{ row }">
        <span class="font-medium text-slate-700 dark:text-slate-200">
          {{ row.name }}
        </span>
      </template>

      <template #cell-user="{ row }">
        <span class="text-slate-600 dark:text-slate-300">
          {{ row.user }}
        </span>
      </template>

      <template #cell-city="{ row }">
        <span class="text-slate-600 dark:text-slate-300">
          {{ row.city }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <ShowButton :to="`/admin/course/${row.id}`" />
          <EditButton :to="`/admin/course/${row.id}/edit`" />
          <DeleteButton
            class="text-xs"
            :confirm-message="`Are you sure you want to delete this course?`"
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
import Heading from "../../../components/heading.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { useSearchStore } from "../../../stores/search";
import { getCourses, deleteCourse, type Course } from "../../../api/courses";

const loading = ref(false);
const page = ref(1);
const pageSize = ref<number | null>(10);
const totalCourses = ref(0);
const courses = ref<Course[]>([]);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);
const typeFilterOptions = ref<{ value: number; label: string }[]>([]);

const searchStore = useSearchStore();
const { query } = storeToRefs(searchStore);

const pageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

const selectedType = ref<number | null>(null);

const columns: TableColumn[] = [
  { key: "name", label: "Course Type", sortable: true },
  { key: "user", label: "User", sortable: true },
  { key: "city", label: "City", sortable: true },
  { key: "actions", label: "Actions" },
];

const filteredRows = computed(() => {
  return courses.value.map((course) => ({
    id: course.id,
    name: course.name,
    phone_num: course.phone_num,
    address: course.address,
    user: course.user_id?.user
      ? `${course.user_id.user.first_name || ""} ${
          course.user_id.user.last_name || ""
        }`.trim() ||
        course.user_id.user.email ||
        `User #${course.user_id.user.id}`
      : "N/A",
    city: course.user_id?.user?.city || "N/A",
  }));
});

const pageSizeNumber = computed(() => Number(pageSize.value ?? 10));

const emptyStateMessage = computed(() => {
  if (!courses.value.length) {
    return query.value
      ? `No courses found for "${query.value}"`
      : "No courses available";
  }
  return "No courses available";
});

async function loadCourses() {
  loading.value = true;
  try {
    const response = await getCourses({
      page: page.value,
      show: pageSizeNumber.value,
      search: query.value || undefined,
      type_id: selectedType.value || undefined,
    });
    courses.value = response.data || [];
    totalCourses.value = response.total || 0;

    // Update type filter options from response
    if (response.type_course && response.type_course.length > 0) {
      typeFilterOptions.value = response.type_course.map(
        (type: { id: number; name: string }) => ({
          value: type.id,
          label: type.name,
        })
      );
    }
  } catch (error) {
    console.error("Failed to load courses", error);
    courses.value = [];
    totalCourses.value = 0;
  } finally {
    loading.value = false;
  }
}

function clearMessages() {
  successMessage.value = null;
  errorMessage.value = null;
}

function showSuccessMessage(message: string) {
  successMessage.value = message;
  setTimeout(clearMessages, 3000);
}

function showErrorMessage(message: string) {
  errorMessage.value = message;
  setTimeout(clearMessages, 3000);
}

async function handleDelete(row: any) {
  try {
    await deleteCourse(row.id);
    showSuccessMessage("Course deleted successfully");
    await loadCourses();
  } catch (error: any) {
    console.error("Failed to delete course", error);
    showErrorMessage(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to delete course"
    );
  }
}

const searchDebounceId = ref<number | null>(null);

watch(query, () => {
  page.value = 1;

  // Debounce backend search to avoid too many requests while typing
  if (searchDebounceId.value !== null) {
    clearTimeout(searchDebounceId.value);
  }

  searchDebounceId.value = window.setTimeout(() => {
    loadCourses();
  }, 500);
});

watch(selectedType, () => {
  page.value = 1;
  loadCourses();
});

watch(pageSize, () => {
  page.value = 1;
  loadCourses();
});

watch(page, () => {
  loadCourses();
});

onMounted(async () => {
  await loadCourses();
  searchStore.setContext({
    placeholder: "Search courses by name, phone, address, user, or city",
    emptyText: "Try typing part of a course name, user name, or city",
  });
  searchStore.clearQuery();
});

onBeforeUnmount(() => {
  searchStore.resetContext();
  searchStore.clearQuery();
});

function onSortChange(payload: { key: string; direction: "asc" | "desc" }) {
  console.log("sort-change", payload);
  // TODO: Implement server-side sorting
}
</script>
