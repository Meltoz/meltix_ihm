<script setup lang="ts">
const emit = defineEmits<{
  retry,
}>();

</script>

<template>
<div class="w-full h-80 flex justify-center items-center">
  <div class="text-center">
    <p>Une erreur est survenue. Merci de ressayer plus tard</p>
    <u-button color="info" @click="emit('retry')" label="Ressayez" />
  </div>
</div>
</template>