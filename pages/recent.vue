<script setup lang="ts">
import { useLatestVideo } from '~/composables/query/video.query';
import Error from '~/components/layout/Error.vue';

const {page} = usePagination()
const { startLoading, stopLoading}= useLoading()
const pageSize = 20;

const {latestVideos, isLatestVideoLoading, isLatestVideoError, isLatestVideoSuccess} = useLatestVideo(page, pageSize)


watch(isLatestVideoLoading, (val) => {
  if (val) startLoading()
  else stopLoading()
}, {immediate: true})
</script>

<template>
<main>
  <h3 class="text-4xl font-poppins font-semibold mb-5 ">Dernières videos</h3>
  <section v-if="isLatestVideoSuccess" class="grid grid-cols-4 gap-5">
    <video-card v-for="video in latestVideos.videos" :key="video.slug" :video="video" />
  </section>
  <section v-else-if="isLatestVideoError" class="w-full">
      <Error />
  </section>
</main>
</template>