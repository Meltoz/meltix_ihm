<script setup lang="ts">

import { useAllTags } from '~/composables/query/tags.query';
import Error from '~/components/layout/Error.vue';

definePageMeta({
  searchPagination: true
})

const {searchQuery, currentPage, goToPage} = useSearchPagination()
const {startLoading, stopLoading} = useLoading();

const pageSize = 40;
const {allTags, isAllTagsSuccess, isAllTagsLoading, isAllTagsError, allTagsRefetch} = useAllTags(currentPage, pageSize, searchQuery)

watch(isAllTagsLoading, (val)=> {
  if(val) startLoading();
  else stopLoading();
}, {immediate: true})
</script>

<template>
<main class="mx-4 w-full">
  <div v-if="isAllTagsSuccess" class="space-y-5">
    <h3 class="font-poppins text-3xl">Tags</h3>
    <div class="grid grid-cols-5 gap-5 w-full">
      <admin-card v-for="tag in allTags.tags" :key="tag.name">
        <div class="flex flex-col items-center">
          <p class="capitalize">{{tag.name}}</p>
          <span>({{tag.count}} vidéos)</span>
        </div>
      </admin-card>
    </div>
    <section v-if="allTags.totalCount > pageSize" class="flex justify-center my-8">
      <UPagination
        :default-page="(currentPage) +1"
        :items-per-page="pageSize"
        :page="currentPage+1"
        color="info"
        variant="ghost"
        :total="allTags.totalCount"
        show-edges
        @update:page="(p) => goToPage(p-1)" />
    </section>
  </div>
  <div v-else-if="isAllTagsError">
    <Error @retry="allTagsRefetch"/>
  </div>
</main>
</template>