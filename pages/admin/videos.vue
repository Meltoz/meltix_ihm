<script setup lang="ts">

import { useUncategorisedVideos } from '~/composables/query/video.query';
import { requestScanVideo } from '~/services/video.service';
import { definePageMeta } from '#imports';
import Error from '~/components/layout/Error.vue';

definePageMeta({
  searchPagination: true
})

const {currentPage, searchQuery, goToPage} = useSearchPagination();
const pageSize = 20;

const sortDirection: Ref<'ascending'|'descending'> = ref('descending');
const sort = computed(() => `update_${sortDirection.value}`);

const {stopLoading, startLoading} = useLoading();

const {uncategorisedVideos, isUncategorisedVideoLoading, isUncategorisedVideosSuccess, isUncategorisedVideoError, uncategorisedVideoRefetch } = useUncategorisedVideos(currentPage, pageSize, sort, searchQuery);

const handleScanClick = async () => {
  await requestScanVideo();
}
watch(isUncategorisedVideoLoading, (val) => {
  if(val) startLoading();
  else stopLoading();
}, {immediate: true})

</script>
<template>
  <main class="mx-2 w-full">
    <div v-if="isUncategorisedVideosSuccess">

      <section class="mb-2 flex flex-col md:flex-row items-start md:justify-between items-center space-y-3">
        <h2 class="text-3xl font-medium">Vidéo non catégorisés ({{uncategorisedVideos?.totalCount}} videos)</h2>
        <UButton color="info" label="Scan"  class="py-3 w-full md:w-fit md:px-20" @click="handleScanClick" />
      </section>
      <section class="my-2">
        <button @click="sortDirection='descending'">Nouvelles importation</button>
        <button @click="sortDirection='ascending'">Les plus anciennes</button>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <VideoCard v-for="video in uncategorisedVideos?.videos" :key="video.id" :video="video" size="l" :edit="true" />
      </section>
      <section v-if="uncategorisedVideos?.totalCount > pageSize" class="flex justify-center my-8">
        <UPagination
          :default-page="(currentPage) +1"
          :items-per-page="pageSize"
          :page="currentPage+1"
          color="info"
          variant="ghost"
          :total="uncategorisedVideos?.totalCount"
          show-edges
          @update:page="(p) => goToPage(p-1)" />
      </section>
    </div>
    <div v-else-if="isUncategorisedVideoError">
      <Error @retry="uncategorisedVideoRefetch"/>
    </div>
  </main>
</template>
