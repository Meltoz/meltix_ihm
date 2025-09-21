<script setup lang="ts">

import Search from '~/components/search.vue';
import { Menu } from 'lucide-vue-next';

const {mobileLinks} = useHeader();
</script>

<template>
  <div class=" px-2 my-4 flex justify-between items-center gap-3">
    <h1 class="text-blue-300 text-5xl md:text-6xl xl:text-7xl cursor-pointer font-poppins italic font-bold" @click="navigateTo('/')">Meltix</h1>
    <Search />
    <UPopover mode="click" :open-delay="100" :close-delay="200" class="block md:hidden">
      <UButton><Menu /></UButton>
      <template #content>
        <UNavigationMenu :items="mobileLinks" orientation="vertical" :ui="{item:'text-7xl', label:'text-7xl', link:'text-2xl'}"/>
      </template>
    </UPopover>
  </div>
</template>
