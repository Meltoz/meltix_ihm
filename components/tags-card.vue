<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="bg-gray-200 rounded-full px-4 w-fit" @click="navigateTo(`/?q=${name}`)">{{name}}</div>
</template>
