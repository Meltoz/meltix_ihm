<script setup lang="ts">

import { useAllTags, useDeleteTag, useEditTag } from '~/composables/query/tags.query';
import Error from '~/components/layout/Error.vue';
import EditTagModal from '~/components/modals/edit-tag-modal.vue';
import type { Tag } from '~/models/tag';
import DeleteModal from '~/components/modals/delete-modal.vue';

definePageMeta({
  searchPagination: true
});
useHead({
  title: 'Meltix | Gestion des tags'
});
const overlay = useOverlay();

const deleteModal = overlay.create(DeleteModal, {
  props:{
    title:"Supression d'un tag",
    description: 'Supprimez ici un tag',
    text: 'Etes-vous sur de vouloir supprimer ce tag'
  }
})
const editModal = overlay.create(EditTagModal);

const {searchQuery, currentPage, goToPage} = useSearchPagination()
const {startLoading, stopLoading} = useLoading();

const pageSize = 40;
const {allTags, isAllTagsSuccess, isAllTagsLoading, isAllTagsError, allTagsRefetch} = useAllTags(currentPage, pageSize, searchQuery)
const {editTag} =  useEditTag();
const {deleteTagAsync} = useDeleteTag();

const handleEditClick = async(event: Tag) => {
  const instance = editModal.open({
    tag: event,
  });

  const tag = await instance.result;

  console.log(tag)
  if(!tag) return;

  try{
    await editTag(tag);
  }
  catch (error){
    console.log(error);
  }
}

const handleDeleteClick = async (event: Tag) => {
  const instance = deleteModal.open();

  const shouldDelete = await instance.result;

  if(!shouldDelete) return;

  try{
    await deleteTagAsync(event.id);
  }
  catch (error){
    console.log(error);
  }
}

watch(isAllTagsLoading, (val)=> {
  if(val) startLoading();
  else stopLoading();
}, {immediate: true});
</script>

<template>
<main class="mx-4 w-full">
  <div v-if="isAllTagsSuccess" class="space-y-5">
    <h2 class="text-2xl md:text-3xl font-medium">Tous les tags</h2>
    <div class="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 w-full">
      <admin-card v-for="tag in allTags.tags"
                  :key="tag.name"
                  @edit="handleEditClick(tag)"
                  @delete="handleDeleteClick(tag)"
      >
        <div class="flex flex-col items-center">
          <p class="capitalize">{{tag.name}}</p>
          <span class="text-xs">({{tag.videoCount}} vidéos)</span>
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