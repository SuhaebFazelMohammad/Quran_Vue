<template>
    <div class="flex items-center justify-between gap-3">
        <h1 class="text-xl font-semibold text-slate-800 dark:text-slate-100">{{ title }}</h1>
        <RouterLink :to="link" 
        class="glass-button bg-amber-500/95 px-4 py-2 text-sm font-medium shadow-amber-500/20"> 
            <span>{{ buttonText }}</span>
            <Icon icon="heroicons:plus-20-solid" class="w-4 h-4" v-if="buttonText.split(' ')[0] === 'Add'" />
            <Icon icon="heroicons:arrow-uturn-left-20-solid" class="w-4 h-4" v-else />
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

const props = defineProps<{
    title: string;
    link: string;
    buttonText: string;
}>();
</script>