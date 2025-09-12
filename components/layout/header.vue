<script setup lang="ts">

import Search from '~/components/search.vue';
import { Menu } from 'lucide-vue-next';

const {links} = useHeader();
</script>

<template>
  <div class=" px-2 my-4 flex justify-between items-center gap-3">
    <h1 class="text-blue-300 text-5xl md:text-6xl xl:text-7xl cursor-pointer font-poppins italic font-bold" @click="navigateTo('/')">Meltix</h1>
    <Search />
    <UPopover mode="hover" :open-delay="100" :close-delay="200" class="block lg:hidden">
      <UButton><Menu /></UButton>
      <template #content>
        <UNavigationMenu :items="links" orientation="vertical"/>
      </template>
    </UPopover>

  </div>
</template>
