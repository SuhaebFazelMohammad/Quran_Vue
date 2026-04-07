<template>
  <div class="space-y-6">
    <Heading title="Create Center Type" link="/admin/center-types" buttonText="Back" />

    <form class="surface-card space-y-6" @submit.prevent="handleSubmit">
      <SuccessMessage v-if="successMessage" :title="successMessage" />
      <ErrorMessage v-if="errorMessage" :title="errorMessage" />

      <Text
        id="name"
        v-model="name"
        label="Center Type Name"
        placeholder="Enter center type name"
        icon-left="heroicons:tag-20-solid"
        :error="nameError"
        clearable
        required
      />

      <button
        type="submit"
        class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20"
      >
        Create Center Type
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Heading from "../../../components/heading.vue";
import Text from "../../../components/input/text.vue";
import SuccessMessage from "../../../components/message/success.vue";
import ErrorMessage from "../../../components/message/error.vue";
import { createCenterType } from "../../../data/centers-local";

const name = ref("");
const nameError = ref("");
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function handleSubmit() {
  nameError.value = "";
  successMessage.value = null;
  errorMessage.value = null;

  if (!name.value.trim()) {
    nameError.value = "Name is required";
    return;
  }

  try {
    createCenterType({ name: name.value });
    name.value = "";
    successMessage.value = "Center type created successfully";
  } catch (error: any) {
    errorMessage.value = error?.message || "Failed to create center type";
  }
}
</script>
