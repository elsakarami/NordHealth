<template>
  <a :href="href || undefined" target="_blank" >
    <slot />
  </a>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
const { href } = defineProps<{
  href: string | null;
}>();
</script>
