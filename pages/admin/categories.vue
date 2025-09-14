<script setup lang="ts">

import { useAllCategories } from '~/composables/query/category.query';

const search = ref<string>('')
const {allCategories} = useAllCategories(search);
</script>

<template>
<main class="mx-4 w-full">
  <div class="flex justify-end">
    <UButton color="info" class="px-8 py-2">Créer</UButton>
  </div>
  <section class="grid grid-cols-5 gap-5">
    <div v-for="category in allCategories?.categories"
         :key="category.id"
         class="flex justify-center items-center border py-6">
      <p >{{category.name}}</p>
    </div>
  </section>


</main>
</template>

<style scoped>

</style>