<template>
  <div class="space-y-6">
    <Heading title="Edit User Center" link="/admin/user-centers" buttonText="Back" />

    <div v-if="notFound" class="surface-card text-center">
      <p class="text-slate-600 dark:text-slate-300">Mapping not found.</p>
    </div>

    <form v-else class="surface-card space-y-5" @submit.prevent="handleSubmit">
      <SuccessMessage v-if="successMessage" :title="successMessage" />
      <ErrorMessage v-if="errorMessage" :title="errorMessage" />

      <Select
        id="quran_center_id"
        v-model="form.quran_center_id"
        :options="centerOptions"
        label="Quran Center"
        :error="errors.quran_center_id"
        :clearable="false"
        :searchable="true"
      />

      <Text
        id="user_id"
        v-model="form.user_id"
        label="User ID"
        placeholder="Enter user id"
        :error="errors.user_id"
        required
      />

      <button type="submit" class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20">
        Save Changes
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Heading from "../../../components/heading.vue";
import Text from "../../../components/input/text.vue";
import Select from "../../../components/input/select.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import {
  getQuranCenters,
  getUserCenter,
  updateUserCenter,
} from "../../../data/centers-local";

const route = useRoute();
const notFound = ref(false);
const errors = ref<Record<string, string>>({});
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const form = ref({
  quran_center_id: 1 as number | undefined,
  user_id: "",
});

const centerOptions = computed(() =>
  getQuranCenters().map((x) => ({ value: x.id, label: `${x.name} (#${x.id})` }))
);

function loadData() {
  const id = Number(route.params.id);
  const row = getUserCenter(id);
  if (!row) {
    notFound.value = true;
    return;
  }
  form.value = {
    quran_center_id: row.quran_center_id,
    user_id: String(row.user_id),
  };
}

function handleSubmit() {
  errors.value = {};
  successMessage.value = null;
  errorMessage.value = null;

  if (!form.value.quran_center_id) errors.value.quran_center_id = "Center is required";
  if (!form.value.user_id.trim()) errors.value.user_id = "User id is required";
  if (Object.keys(errors.value).length) return;

  const id = Number(route.params.id);
  const updated = updateUserCenter(id, {
    quran_center_id: Number(form.value.quran_center_id),
    user_id: Number(form.value.user_id),
  });

  if (!updated) {
    errorMessage.value = "Mapping not found";
    return;
  }

  successMessage.value = "User-center mapping updated successfully";
}

onMounted(loadData);
</script>
