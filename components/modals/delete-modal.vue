<script setup lang="ts">
import ModalItem from '~/components/modals/modal-item.vue';

defineProps<{
  text: string,
  title: string,
  description: string
}>();
const emit = defineEmits<{ close: [boolean] }>();
</script>

<template>
  <ModalItem
    :title="title"
    :description="description"
    :close="{onClick: () => emit('close', false)}"
  >
    <template #content>
      <p>{{text}}</p>
    </template>

    <template #footer>
      <div class="flex gap-2 ml-auto">
        <UButton color="neutral" label="Annuler" @click="emit('close', false)" class="cursor-pointer"/>
        <UButton color="error" label="Supprimer" @click="emit('close', true)" class="cursor-pointer"/>
      </div>
    </template>
  </ModalItem>


</template>