<script setup lang="ts" xmlns:UModal="http://www.w3.org/1999/html">
defineProps<{
  title?: string,
  description?: string
}>();
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{title: 'text-base', close:'cursor-pointer'}"
  >
    <template #body><slot name="content" /></template>
    <template #footer v-if="$slots.footer"><slot name="footer" /></template>
  </UModal>
</template>