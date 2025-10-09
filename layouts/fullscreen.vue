<script setup lang="ts">

import Header from '~/components/layout/header.vue';
</script>

<template>
  <div>
    <Header class="sticky top-0 backdrop-blur-lg z-50"/>
    <slot />
  </div>
</template>

<style scoped>

</style>