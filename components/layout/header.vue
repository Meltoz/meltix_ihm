<script setup lang="ts">

import Search from '~/components/search.vue';
</script>

<template>
  <div class="mx-4 xl:mx-16 my-4 flex justify-between items-center">
    <h1 class="text-blue-300 text-7xl cursor-pointer font-poppins italic font-bold" @click="navigateTo('/')">Meltix</h1>
    <Search />
  </div>
</template>
