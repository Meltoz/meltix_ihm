<script setup lang="ts">

import { useAllCategories } from '~/composables/query/category.query';

const {allCategories} = useAllCategories(0,200,"");
</script>

<template>
<main class="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 w-full gap-3 xl:gap-10 mx-2 h-fit">
  <div v-for="category in allCategories?.categories"
       :key="category.id"
       @click="navigateTo(`/?q=${category.name}`)"
       class="border rounded-lg flex justify-center items-center cursor-pointer py-2 xl:py-8 hover:bg-blue-300 hover:text-black transition-colors duration-300"
  >
    <p class="font-inter">{{category.name}}</p>
  </div>
</main>
</template>