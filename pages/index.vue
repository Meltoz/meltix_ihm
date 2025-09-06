<script setup lang="ts">

import transitionConfig from '~/helpers/transition-config';

definePageMeta({
  pageTransition: transitionConfig,
});

useHead({
  title: 'Meltix',
});

const {page, q} = usePagination();
const pageSize = 4*5;

const loadedCount = ref(0)
const totalImages = computed(() => allVideos.value?.videos?.length || 0)
const allLoaded = computed(() => totalImages.value > 0 && loadedCount.value >= totalImages.value)

const {allVideos, allVideoRefrech} = useAllVideos(page, pageSize, q);

const onImageVideoLoad = () =>{
  loadedCount.value++;
}

onMounted(() => {
  allVideoRefrech();
})
</script>

<template>
  <div class="">
    <section class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mx-4 xl:mx-10">
      <video-card v-for="video in allVideos?.videos"
                  :video="video"
                  size="l"
                  @load="onImageVideoLoad"/>

    </section>
    <div class="flex justify-center my-10">
      <UPagination
        :default-page="(page || 0) +1"
        :items-per-page="pageSize"
        :total="allVideos?.totalCount"
        show-edges
        @update:page="(p) => {page = p-1; loadedCount=0}"
      />
    </div>
  </div>
</template>