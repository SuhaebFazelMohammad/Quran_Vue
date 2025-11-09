<script setup lang="ts">
import AdminLayout from "./layouts/adminLayout.vue";
import AuthLayout from "./layouts/authLayout.vue";
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <AuthLayout v-if="route.name === 'login'" />
  <AdminLayout v-else />
</template>
