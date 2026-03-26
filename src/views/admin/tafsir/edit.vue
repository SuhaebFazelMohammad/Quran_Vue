<template>
  <div class="space-y-6">
    <Heading title="Edit Tafsir" link="/admin/tafsir" buttonText="Back" />

    <form @submit.prevent="handleSubmit" class="surface-card w-full space-y-6" novalidate>
      <SuccessMessage
        v-if="successMessage"
        :title="successMessage"
        message="Static mode only: changes are local preview."
      />

      <Text
        id="title"
        v-model="form.title"
        label="Tafsir Title"
        placeholder="Enter tafsir title"
        icon-left="heroicons:book-open-20-solid"
        required
      />

      <Select
        id="language"
        v-model="form.language"
        :options="languageOptions"
        label="Language"
        placeholder="Select language"
        icon-left="heroicons:language-20-solid"
        :clearable="false"
        :searchable="false"
        required
      />

      <Text
        id="source"
        v-model="form.source"
        label="Source"
        placeholder="Enter source"
        icon-left="heroicons:link-20-solid"
      />

      <Textarea
        id="content"
        v-model="form.content"
        label="Content"
        placeholder="Write tafsir content"
        icon-left="heroicons:pencil-square-20-solid"
        :rows="6"
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
        >
          Save Changes
        </button>
        <RouterLink
          to="/admin/tafsir"
          class="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-amber-300 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-200"
        >
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import Heading from "../../../components/heading.vue";
import Text from "../../../components/input/text.vue";
import Textarea from "../../../components/input/textarea.vue";
import Select from "../../../components/input/select.vue";
import SuccessMessage from "../../../components/message/success.vue";

const route = useRoute();
const tafsirId = Number(route.params.id || 1);
const successMessage = ref<string | null>(null);

const form = ref({
  title: `Sample Tafsir #${tafsirId}`,
  language: "Arabic",
  source: "Manual",
  content: "This is a static tafsir edit preview.",
});

const languageOptions = [
  { value: "Arabic", label: "Arabic" },
  { value: "English", label: "English" },
  { value: "Urdu", label: "Urdu" },
];

function handleSubmit() {
  successMessage.value = "Tafsir updated (static preview)";
  window.setTimeout(() => {
    successMessage.value = null;
  }, 2500);
}
</script>
