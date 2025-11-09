<template>
    <div class="flex items-center justify-between">
        <h1 class="text-base font-semibold text-slate-800">{{ title }}</h1>
        <RouterLink :to="link" 
        class="px-3 py-2 rounded-lg flex items-center gap-x-2 bg-amber-500 text-white text-sm hover:brightness-105 active:translate-y-px"> 
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