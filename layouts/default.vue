<template>
  <UMain class="mx-2 overflow-x-hidden">
    <Header class="sticky top-0 backdrop-blur-lg z-50"/>
    <div class="flex">
      <div
        class="sticky top-[5.5rem] h-screen hidden md:block"
      :class="close ? 'w-14': 'basis-96'">
          <button @click="close = !close"
          class="flex justify-end w-full pr-3">
          <component
            :is="close ? ArrowRightFromLine : ArrowLeftFromLine"
          class="text-gray-500 hover:text-blue-500 cursor-pointer"/></button>
        <UNavigationMenu :items="desktopLinks" orientation="vertical" color="info" variant="outline" :open="false" :collapsed="close" :popover="close" class="my-3"/>
      </div>
      <slot class=""/>
    </div>
    <Footer />
  </UMain>
</template>
<script setup lang="ts">

import Header from '~/components/layout/header.vue';
import Footer from '~/components/layout/footer.vue';
import { ArrowLeftFromLine, ArrowRightFromLine} from 'lucide-vue-next';

const {desktopLinks} = useHeader();
const close = ref(false);
</script>
