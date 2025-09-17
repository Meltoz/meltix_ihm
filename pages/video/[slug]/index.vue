<script setup lang="ts">
import { useDetailVideo, useGetRecommendation } from '~/composables/query/video.query';
import { Pen } from 'lucide-vue-next';

const route = useRoute();
const {startLoading, stopLoading} = useLoading();

const slug = computed(() => {
  const param = route.params.slug || '';
  return Array.isArray(param) ? param[0] || '' : param;
});
const pageSize = 10;

const { video, isVideoLoading, isVideoError } = useDetailVideo(slug);
const { recommendations, hasNextRecommendations, fetchNextRecommendations } = useGetRecommendation(
  slug,
  pageSize
);

useHead(() => ({
  title:
    isVideoLoading.value ? 'Chargement...' : `Meltix | ${video.value?.title}`,
}));

watch(isVideoLoading, (val) => {
  if(val) startLoading();
  else stopLoading();
},{immediate:true});

const handleClickEdit = () => {
  navigateTo(`${video.value?.slug}/edit`);
};
</script>

<template>
  <main class="mx-2 xl:mx-16 font-inter">
    <section class="flex justify-between mb-5">
      <div class="flex gap-2 italic text-black">
        <p class="bg-red-300 rounded-full px-3" @click="navigateTo(`/?q=${video?.category}`)">
          {{ video?.category }}
        </p>
        <tags-card v-for="tag in video?.tags" :name="tag" />
      </div>
      <Pen @click="handleClickEdit" class="cursor-pointer" />
    </section>

    <div v-if="video">
      <video-player :slug="video.slug" />
    </div>
    <section class="my-5 space-y-3">
      <h2 class="text-4xl font-poppins">{{ video?.title }}</h2>
      <p class="">{{ video?.description }}</p>
    </section>

    <section
      v-if="recommendations.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 xl:gap-x-10 gap-y-2 xl:gap-y-5"
    >
      <video-card v-for="video in recommendations" :video="video" size="s" />
    </section>
    <div v-if="hasNextRecommendations" class="flex justify-center my-5">
      <button class="cursor-pointer w-1/2 bg-red-300 py-2" @click="fetchNextRecommendations">
        Voir plus
      </button>
    </div>
  </main>
</template>

<style scoped></style>