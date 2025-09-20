<template>
  <div v-if="isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">

import { useLoading } from '~/composables/useLoading';

const { isLoading } = useLoading()
</script>

<style scoped>
.loader {
  height: 15px;
  aspect-ratio: 5;
  display: grid;
  --_g: no-repeat radial-gradient(farthest-side, oklch(80.9% 0.105 251.813) 94%, #0000);
}
.loader:before,
.loader:after {
  content: "";
  grid-area: 1/1;
  background:
    var(--_g) left,
    var(--_g) right;
  background-size: 20% 100%;
  animation: l32 1s infinite;
}
.loader:after {
  background:
    var(--_g) calc(1*100%/3),
    var(--_g) calc(2*100%/3);
  background-size: 20% 100%;
  animation-direction: reverse;
}
@keyframes l32 {
  80%,100% {transform:rotate(.5turn)}
}
</style>