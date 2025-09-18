<script setup lang="ts">
import { useLatestVideo } from '~/composables/query/video.query';
import Error from '~/components/layout/Error.vue';

const {currentPage, goToPage} = useSearchPagination()
const { startLoading, stopLoading}= useLoading()
const pageSize = 20;

const {latestVideos, isLatestVideoLoading, isLatestVideoError, isLatestVideoSuccess} = useLatestVideo(currentPage, pageSize)


watch(isLatestVideoLoading, (val) => {
  if (val) startLoading()
  else stopLoading()
}, {immediate: true})
</script>

<template>
<main>
  <h3 class="text-4xl font-poppins font-semibold mb-5 ">Dernières videos</h3>
  <div v-if="isLatestVideoSuccess">
    <section class="grid grid-cols-4 gap-5">
      <video-card v-for="video in latestVideos.videos" :key="video.slug" :video="video" />
    </section>
    <div v-if="latestVideos.totalCount > pageSize" class="flex justify-center my-8">
      <UPagination
        :default-page="(currentPage) +1"
        :items-per-page="pageSize"
        :page="currentPage+1"
        color="info"
        variant="ghost"
        :total="latestVideos.totalCount"
        show-edges
        @update:page="(p) => goToPage(p-1)" />
    </div>
  </div>

  <section v-else-if="isLatestVideoError" class="w-full">
      <Error />
  </section>
</main>
</template>