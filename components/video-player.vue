<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Plyr from 'plyr';
import type { Video } from '~/models/video';

const config = useRuntimeConfig();

const props =defineProps<{
  slug: string
}>();

const videoRef = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (videoRef.value) {
    const plry = new Plyr(videoRef.value, {
      controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      fullscreen: { enabled: true, fallback: true, iosNative: true },
    })
    plry.elements.container.classList.add('h-[70vh]', 'rounded-lg')
  }
})
</script>

<template>
  <div class="">
    <video ref="videoRef" playsinline class="object-contain">
      <source
        :src="`https://localhost:7214/api/video/GetVideo?slug=${slug}`"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<style>
.plyr--fullscreen video {
  width: 100% !important;
  height: 100% !important;
  max-height: none !important;
  object-fit: contain; /* ou cover selon ton besoin */
}
</style>