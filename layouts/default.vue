<template>
  <UMain class="max-w-full">
    <Header class="sticky top-0 backdrop-blur-lg"/>
    <div class="flex" >
      <UPageAside
        class="sticky -my-8"
      :class="close ? 'w-fit': 'w-72'">
        <div class="flex justify-end"
        :class="close ? 'ml-3' : 'mr-3'">
          <button @click="close = !close">
          <component
            :is="close ? ArrowRightFromLine : ArrowLeftFromLine"
          class="text-gray-500 hover:text-blue-500 cursor-pointer "/></button>
        </div>

        <UNavigationMenu :items="links" orientation="vertical" color="info" variant="outline" :open="false" :collapsed="close" :popover="close" class="my-3"/>
      </UPageAside>
      <slot class="shrink"/>
    </div>
    <Footer />
  </UMain>
</template>
<script setup lang="ts">

import Header from '~/components/layout/header.vue';
import Footer from '~/components/layout/footer.vue';
import { ArrowLeftFromLine, ArrowRightFromLine} from 'lucide-vue-next';

const {links} = useHeader();
const close = ref(false);
</script>
