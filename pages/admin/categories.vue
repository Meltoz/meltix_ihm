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

const overlay = useOverlay();

const deleteModal = overlay.create(DeleteModal,{
  props:{
    title:"Suppression d'une catégorie",
    description: 'Supprimez ici une catégorie',
    text: 'Etes-vous sur de vouloir supprimer cette catégorie'
  }
});
const editModal = overlay.create(EditCategoryModal);

const search = ref<string>('');
const { allCategories } = useAllCategories(search);
const { addCategoryAsync } = useAddCategory();
const { updateCategoryAsync } = useUpdateCategory();
const { deleteCategoryAsync } = useDeleteCategory();

const handleCreateCategoryClick = async (event?: Category) => {
  const instance = editModal.open({
    category: event || {},
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
</script>

<template>
  <main class="mx-4 w-full space-y-5">
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
      <div
        v-for="category in allCategories?.categories"
        :key="category.id"
        class="flex justify-center items-center border py-6 relative rounded-lg group"
      >
        <div class="absolute top-2 right-2 md:invisible group-hover:visible flex flex-col gap-3">
          <button class="cursor-pointer" @click.stop="handleCreateCategoryClick(category)"><Pencil class="size-5"/></button>
          <button class="cursor-pointer" @click.stop="handleDeleteCategoryClick(category)"><Trash2 class="size-5"/></button>
        </div>

        <p>{{ category.name }}</p>
      </div>
    </section>
  </main>
</template>

<style scoped></style>