<script setup lang="ts">

import { useUncategorisedVideos } from '~/composables/query/video.query';
import { requestScanVideo } from '~/services/video.service';

const {q, page} = usePagination();
const pageSize = 20;


const {uncategorisedVideos, isUncategorisedVideoLoading} = useUncategorisedVideos(page, pageSize, q);

const handleScanClick = async () => {
  await requestScanVideo();
}

</script>
<template>
  <main class="mx-2 w-full">
    <div class="mb-5 flex flex-col md:flex-row items-start md:justify-between items-center space-y-3">
      <h2 class="text-3xl font-medium">Vidéo non catégorisés ({{uncategorisedVideos?.totalCount}} videos)</h2>
      <UButton color="info" label="Scan"  class="py-3 w-full md:w-fit md:px-20" @click="handleScanClick" />
    </div>

    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      <VideoCard v-for="video in uncategorisedVideos?.videos" :key="video.id" :video="video" size="l" :edit="true" />
    </section>
    <div v-if="uncategorisedVideos?.totalCount > pageSize" class="flex justify-center my-8">
      <UPagination
        :default-page="(page || 0) +1"
        :items-per-page="pageSize"
        color="info"
        variant="ghost"
        :total="uncategorisedVideos?.totalCount"
        show-edges
        @update:page="(p) => page = p-1" />
    </div>
  </main>
</template>
