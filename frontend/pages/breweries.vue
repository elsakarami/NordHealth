<template>
  <div class="breweries-container">
    <BreweryTableOrg/>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>
