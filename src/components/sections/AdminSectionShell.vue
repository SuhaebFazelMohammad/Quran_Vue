<template>
  <section class="space-y-5">
    <div class="rounded-2xl border border-slate-200/70 bg-white/85 p-5 shadow-xl shadow-amber-500/10 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-900/60 dark:shadow-black/40">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {{ title }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ description }}
          </p>
        </div>
        <span
          class="inline-flex items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/20 dark:text-amber-200"
        >
          Static Demo Data
        </span>
      </div>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
