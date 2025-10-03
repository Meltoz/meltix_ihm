<script setup lang="ts">

import { useRequestScan, useUncategorisedVideos } from '~/composables/query/video.query';
import { definePageMeta } from '#imports';
import Error from '~/components/layout/Error.vue';

definePageMeta({
  searchPagination: true,
  middleware: 'admin'
});
useHead({
  title: 'Meltix | Gestion des vidéos'
});

const {currentPage, searchQuery, goToPage} = useSearchPagination();
const pageSize = 20;

const sortDirection: Ref<'ascending'|'descending'> = ref('descending');
const sort = computed(() => `update_${sortDirection.value}`);

const {stopLoading, startLoading} = useLoading();

const {uncategorisedVideos, isUncategorisedVideoLoading, isUncategorisedVideosSuccess, isUncategorisedVideoError, uncategorisedVideoRefetch } = useUncategorisedVideos(currentPage, pageSize, sort, searchQuery);
const { requestScanAsync, isRequestScanLoading, isRequestScanSuccess, isRequestScanError } = useRequestScan();

const handleScanClick = async () => {
  console.log("Scan click");
  await requestScanAsync();
}
watch(isUncategorisedVideoLoading, (val) => {
  if(val) startLoading();
  else stopLoading();
}, {immediate: true})

</script>
<template>
  <main class="w-full">
    <div v-if="isUncategorisedVideosSuccess">
      <section class="mb-2 flex flex-col md:flex-row items-start md:justify-between space-y-3">
        <h2 class="text-2xl md:text-3xl font-medium">Vidéo non catégorisés <span class="italic">({{uncategorisedVideos?.totalCount}} videos)</span></h2>
        <UButton color="info" label="Scan"  class="py-3 w-full md:w-fit md:px-20 cursor-pointer disabled:bg-gray-600" @click="handleScanClick" :disabled="isRequestScanLoading"/>
      </section>
      <section class="my-2">
        <button @click="sortDirection='descending'">Nouvelles importation</button>
        <button @click="sortDirection='ascending'">Les plus anciennes</button>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <VideoCard v-for="video in uncategorisedVideos.videos" :key="video.id" :video="video" size="l" :edit="true" />
      </section>
      <section v-if="uncategorisedVideos.totalCount > pageSize" class="flex justify-center my-8">
        <UPagination
          :default-page="(currentPage) +1"
          :items-per-page="pageSize"
          :page="currentPage+1"
          size="sm"
          color="info"
          variant="ghost"
          :total="uncategorisedVideos?.totalCount"
          :sibling-count="1"
          show-edges
          @update:page="(p) => goToPage(p-1)" />
      </section>
    </div>
    <div v-else-if="isUncategorisedVideoError">
      <Error @retry="uncategorisedVideoRefetch"/>
    </div>
  </main>
</template>
