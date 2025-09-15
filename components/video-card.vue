<script setup lang="ts">

import type { VideoCard } from '~/models/video';
const config = useRuntimeConfig();
const props = withDefaults(defineProps<{
  video: VideoCard,
  size?: 's' | 'm' | 'l';
  edit?: boolean
}>(), {
  size: 'm',
  edit: false,
});

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
  <div class=" w-full cursor-pointer space-y-5 rounded-lg overflow-hidden group hover:bg-blue-500/20 transition-colors duration-300" @click="navigateTo(`/video/${video.slug}${edit ? '/edit': ''}`)">
    <div class="overflow-hidden border border-red-200 rounded-lg">
      <img :src="`${config.public.apiBaseUrl}/api/video/getthumbnail?slug=${video.slug}`"
           class="w-full object-cover group-hover:scale-110 transition-all duration-300"
           :class="size === 's' ? 'h-40' : size === 'm' ? 'h-60' : 'h-80'"
           alt="Image"
           @load="loaded"
      />
    </div>

    <div class="font-inter px-2">
      <h3 class="clamp-2 text-2xl text-center font-poppins">{{video.title}}</h3>
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
