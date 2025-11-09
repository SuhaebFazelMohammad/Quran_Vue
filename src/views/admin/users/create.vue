<template>
  <div class="space-y-6">
    <Heading title="Create User" link="/users" buttonText="Back" />

    <form @submit.prevent="handleSubmit" class="surface-card max-w-2xl space-y-5">
      <Text
        id="name"
        v-model="form.name"
        label="Full Name"
        placeholder="Enter full name"
        icon-left="heroicons:user-20-solid"
        :error="errors.name"
        clearable
        required
      />

      <Text
        id="email"
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="Enter email address"
        icon-left="heroicons:envelope-20-solid"
        :error="errors.email"
        hint="We'll use this email for account verification"
        clearable
        autocomplete="email"
      />

      <Text
        id="password"
        v-model="form.password"
        type="password"
        label="Password"
        placeholder="Enter password"
        icon-left="heroicons:lock-closed-20-solid"
        :error="errors.password"
        hint="Must be at least 8 characters"
        clearable
        autocomplete="new-password"
      />

      <Text
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm password"
        icon-left="heroicons:key-20-solid"
        :error="errors.confirmPassword"
        clearable
        autocomplete="new-password"
      />

      <div class="flex items-center gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="glass-button bg-amber-500/95 px-4 py-2.5 text-sm font-semibold shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create User</span>
        </button>
        <RouterLink
          to="/users"
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
import { RouterLink } from "vue-router";
import Text from "../../../components/input/text.vue";
import Heading from "../../../components/heading.vue";

const loading = ref(false);

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref<{
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}>({});

function validateForm() {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = "Name is required";
  }

  if (!form.value.email.trim()) {
    errors.value.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = "Please enter a valid email address";
  }

  if (!form.value.password) {
    errors.value.password = "Password is required";
  } else if (form.value.password.length < 8) {
    errors.value.password = "Password must be at least 8 characters";
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password";
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
  }

  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    console.log("Creating user:", form.value);
    loading.value = false;
    // Here you would typically navigate back or show success message
  }, 1000);
}
</script>

<style scoped></style>
