<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{
  edit;
  delete;
}>();

const handleEdit = () => {
  emit('edit');
};

const handleDelete = () => {
  emit('delete');
};
</script>

<template>
  <div class="flex justify-center items-center w-full border py-6 relative rounded-lg group">
    <div class="absolute top-2 right-2 md:invisible group-hover:visible flex flex-col gap-3">
      <button class="cursor-pointer" @click.stop="handleEdit">
        <Pencil class="size-5" />
      </button>
      <button class="cursor-pointer" @click.stop="handleDelete">
        <Trash2 class="size-5" />
      </button>
    </div>
    <slot />
  </div>
</template>

<style scoped></style>