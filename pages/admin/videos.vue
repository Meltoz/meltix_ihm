<script setup lang="ts">

import { useUncategorisedVideos } from '~/composables/query/video.query';

const page = ref(0);
const search = ref<string>('');

const {uncategorisedVideos, isUncategorisedVideoLoading} = useUncategorisedVideos(page, 20, search);

</script>
<template>
  <main class="mx-2 w-full">
    <div class="mb-5 flex flex-col md:flex-row items-start md:justify-between items-center space-y-3">
      <h2 class="text-3xl font-medium">Vidéo non catégorisés</h2>
      <UButton color="info" label="Scan"  class="py-3 w-full md:w-fit md:px-20" />
    </div>

    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      <VideoCard v-for="video in uncategorisedVideos?.videos" :key="video.id" :video="video" size="l" :edit="true" />
    </section>
  </main>
</template>
