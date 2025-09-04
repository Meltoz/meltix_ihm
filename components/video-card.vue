<script setup lang="ts">
import type { VideoCard } from '~/models/video';

const props = defineProps<{
  video: VideoCard,
  size: 's' | 'm' | 'l',
}>();

const emit = defineEmits<{
  load: [boolean]
}>()

const loaded = () => {
  emit('load', true)
}

const calcDuration = (seconds: number) => {
  if (seconds < 0) return "0min";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}min `;
  if (hours === 0 && minutes === 0) result += `${seconds}s`;

  return result.trim();

}
</script>

<template>
  <div class=" w-full cursor-pointer space-y-5" @click="navigateTo(`/video/${video.slug}`)">
    <img :src="`https://localhost:7214/api/video/getthumbnail?slug=${video.slug}`"
         class="h-80 w-full object-cover"
         alt="Image"
         @load="loaded"
    />
    <div>
      <h3 class="clamp-2 text-2xl text-center">{{video.title}}</h3>
      <div class="flex justify-center gap-2">
        <p>{{video.category}}</p>
        <p>{{calcDuration(video.duration)}}</p>
      </div>

    </div>

  </div>
</template>

<style>
.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limite à 2 lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
