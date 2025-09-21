<script setup lang="ts">

import transitionConfig from '~/helpers/transition-config';
import { useAllVideos } from '~/composables/query/video.query';
import Error from '~/components/layout/Error.vue';

definePageMeta({
  pageTransition: transitionConfig,
  searchPagination: true
});

useHead({
  title: 'Meltix',
});

const {currentPage, searchQuery, goToPage} = useSearchPagination();
const pageSize = 4*5;
const direction: Ref<'descending'|'ascending'> = ref('descending');
const {startLoading, stopLoading} = useLoading()

const sort = computed(() => `update_${direction.value}`);
const loadedCount = ref(0)
const totalImages = computed(() => allVideos.value?.videos?.length || 0)
const allLoaded = computed(() => totalImages.value > 0 && loadedCount.value >= totalImages.value)

const {allVideos, isAllVideosLoading, isAllVideosSuccess, isAllVideosError} = useAllVideos(currentPage, pageSize, sort, searchQuery);

const onImageVideoLoad = () =>{
  loadedCount.value++;
}

watchEffect(() => {
  if(isAllVideosLoading.value && !allLoaded.value) {
    startLoading()
  } else {
    stopLoading()
  }
})
</script>

<template>
  <main class="w-full px-2">
    <div v-if="isAllVideosSuccess">
      <section class="flex gap-10 my-3">
        <button @click="direction='descending'">Les plus recentes</button>
        <button @click="direction='ascending'">Les plus anciennes</button>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        <video-card v-for="video in allVideos.videos"
                    :video="video"
                    size="l"
                    @load="onImageVideoLoad"/>

      </section>
      <div class="flex justify-center my-10">
        <UPagination
          :default-page="(currentPage || 0) +1"
          :items-per-page="pageSize"
          color="info"
          variant="ghost"
          :total="allVideos.totalCount"
          show-edges
          @update:page="(p) => {goToPage(p-1); loadedCount=0}"
        />
      </div>
    </div>
    <section v-else-if="isAllVideosError">
      <Error />
    </section>

  </main>
</template>