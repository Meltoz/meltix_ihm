<script setup lang="ts">

import { useAllCategories } from '~/composables/query/category.query';

const search = ref<string>('')
const {allCategories} = useAllCategories(search);
</script>

<template>
<main class="grid grid-cols-3  md:grid-cols-4 xl:grid-cols-5 w-full gap-3 xl:gap-10 mx-2">
  <div v-for="category in allCategories?.categories"
       :key="category.id"
       @click="navigateTo(`/?q=${category.name}`)"
       class="border rounded-lg h-20 flex justify-center items-center cursor-pointer hover:bg-blue-300 hover:text-black transition-colors duration-300"
  >
    <p class="font-inter">{{category.name}}</p>
  </div>
</main>
</template>