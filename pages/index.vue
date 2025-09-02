<script setup lang="ts">

import transitionConfig from '~/helpers/transition-config';

definePageMeta({
  pageTransition: transitionConfig,
});

useHead({
  title: 'Meltix',
});

const pageIndex = ref<number>(0);
const pageSize = 4*5;
const search = ref<string>('');


const loadedCount = ref(0)
const totalImages = computed(() => allVideos.value?.videos?.length || 0)
const allLoaded = computed(() => totalImages.value > 0 && loadedCount.value >= totalImages.value)

const {allVideos} = useAllVideos(pageIndex, pageSize, search);

const onImageVideoLoad = () =>{
  loadedCount.value++;
}
</script>

<template>
  <div class="">
    <div>
      <h1 class="text-red-600 font-medium text-7xl">Meltix</h1>
    </div>

    <section class="grid grid-cols-4 gap-5 mx-10">
      <video-card v-for="video in allVideos?.videos" :video="video" @load="onImageVideoLoad"/>

    </section>
    <div class="flex justify-center my-10">
      <UPagination
        :default-page="(pageIndex || 0) +1"
        :items-per-page="pageSize"
        :total="allVideos?.totalCount"
        show-edges
        @update:page="(p) => {pageIndex = p-1; loadedCount=0}"
      />
    </div>


  </div>

</template>

<style scoped>

</style>