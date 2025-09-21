<script setup lang="ts">
import type { Category } from '~/models/category';
import ModalItem from '~/components/modals/modal-item.vue';

const props = defineProps<{
  category: Category
}>();

const emit = defineEmits<{
  close: [Category]
}>();

const name = ref<string>(props.category.name);

const handleSaveClick = () => {
  const c:Category = {name: name.value, ...props.category};
  emit('close', c);
}
</script>

<template>
<ModalItem description="Créer ou modifier une catégorie"
           title="Modifier une catégorie"
            :close="{onClick: () => emit('close', null)}">
  <template #content>
    <div class="space-y-2">
      <UFormField label="Nom de la catégorie" class="w-full">
        <UInput v-model="category.name" class="w-full" />
      </UFormField>
    </div>
  </template>
  <template #footer>
    <div class="ml-auto space-x-2">
      <UButton color="neutral" variant="outline" label="Annuler" @click="() => emit('close', null)" class="cursor-pointer"/>
      <UButton color="info" label="Sauvegarder" @click="handleSaveClick" class="cursor-pointer" />
    </div>
  </template>
</ModalItem>
</template>