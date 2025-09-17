<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Loading />
  </UApp>
</template>
<script setup lang="ts">
import Loading from '~/components/layout/loading.vue';
</script>