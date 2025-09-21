<script setup lang="ts">
import {
  useAddCategory,
  useAllCategories, useDeleteCategory,
  useUpdateCategory,
} from '~/composables/query/category.query';
import { Plus, Trash2, Pencil } from 'lucide-vue-next';
import DeleteModal from '~/components/modals/delete-modal.vue';
import EditCategoryModal from '~/components/modals/edit-category-modal.vue';
import type { Category } from '~/models/category';
import AdminCard from '~/components/admin-card.vue';
import Error from '~/components/layout/Error.vue';

definePageMeta({
  searchPagination: true,
});

const overlay = useOverlay();
const deleteModal = overlay.create(DeleteModal,{
  props:{
    title:"Suppression d'une catégorie",
    description: 'Supprimez ici une catégorie',
    text: 'Etes-vous sur de vouloir supprimer cette catégorie'
  }
});
const editModal = overlay.create(EditCategoryModal);

const {searchQuery, currentPage, goToPage} = useSearchPagination();
const pageSize = 20;

const { allCategories, isAllCategoriesSuccess, isAllCategoriesError, isAllCategoriesLoading } = useAllCategories(currentPage, pageSize, searchQuery);
const { addCategoryAsync } = useAddCategory();
const { updateCategoryAsync } = useUpdateCategory();
const { deleteCategoryAsync } = useDeleteCategory();
const {stopLoading, startLoading} = useLoading()

const handleCreateCategoryClick = async (event?: Category) => {
  const instance = editModal.open({
    category: event || {} as Category,
  });
  const category = await instance.result;

  if (!category) return;

  try {
    if (event) {
      await updateCategoryAsync(category);
    } else {
      await addCategoryAsync(category);
    }
  } catch (err) {
    console.error(err);
  }
};
const handleDeleteCategoryClick = async (event?: Category) => {
  const instance = deleteModal.open();

  const shouldDeleteCategory = await instance.result;
  if(!shouldDeleteCategory) return;

  try{
    await deleteCategoryAsync(event.id);
  }
  catch(err){
    console.error(err);
  }
}

watch(isAllCategoriesLoading, (val) => {
  if(val) startLoading()
  else stopLoading()
}, {immediate: true});

</script>

<template>
  <main class="mx-4 w-full space-y-5">
    <div v-if="isAllCategoriesSuccess">
      <div class="flex justify-end">
        <UButton
          color="info"
          class="w-full md:w-fit px-8 py-2 cursor-pointer flex flex-row justify-center"
          @click="handleCreateCategoryClick(null)"
        >
          <Plus />
          Catégorie
        </UButton>
      </div>
      <section class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          <admin-card v-for="category in allCategories.categories"
                      :key="category.id"
                      @delete="handleDeleteCategoryClick(category)"
                      @edit="handleCreateCategoryClick(category)">
            <p>{{category.name}}</p>
          </admin-card>
      </section>
      <section v-if="allCategories.totalCount > pageSize" class="flex justify-center my-8">
        <UPagination
          :default-page="(currentPage) +1"
          :items-per-page="pageSize"
          :page="currentPage+1"
          color="info"
          variant="ghost"
          :total="allCategories.totalCount"
          show-edges
          @update:page="(p) => goToPage(p-1)" />
      </section>
    </div>
    <div v-else-if="isAllCategoriesError">
      <Error />
    </div>

  </main>
</template>

<style scoped></style>