<script setup lang="ts">

import type { Tag } from '~/models/tag';
import ModalItem from '~/components/modals/modal-item.vue';

const props = defineProps<{
  tag: Tag
}>();

const emit = defineEmits<{
  close: [Tag]
}>();

const name = ref<string>(props.tag.name);

const handleSaveClick = () => {
  const t: Tag = {...props.tag, name: name.value};
  console.log('t', t);
  emit('close', t);
}
</script>

<template>

  <ModalItem title="Modifier un tag"
    description="Modification un tag"
             :close="{onClick: () =>emit('close', null)}">
    <template #content>
      <div class="space-y-2">
        <UFormField label="Tag" class="w-full">
          <UInput v-model="name" class="w-full" />
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