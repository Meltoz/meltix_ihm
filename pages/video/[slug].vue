<script setup lang="ts">
import { useDetailVideo } from '~/composables/video.query';

const route = useRoute();

const slug = computed(() => route.params.slug);
const pageSize = 10;

const {video, isVideoLoading, isVideoError} = useDetailVideo(slug);
const {recommendations,recommendationsNextPage ,isRecommendationNextPage} = useGetRecommandation(slug,  pageSize);

useHead(() => ({
  title: isVideoLoading.value || isVideoError.value ? 'Chargement...' : `Meltix | ${video.value?.title}`,
}))
</script>

<template>
  <main class="mx-2 xl:mx-16 font-inter">
    <div class="flex gap-2 my-5 italic">
      <p class="bg-red-300 rounded-full px-3" @click="navigateTo(`/?q=${video?.category}`)">{{video?.category}}</p>
      <tags-card v-for="tag in video?.tags" :name="tag" />
    </div>
    <div class="h-[70vh] bg-red-300 flex justify-center items-center">PLAYER</div>
    <section class="my-5 space-y-3">
      <h2 class="text-4xl font-poppins">{{video?.title}}</h2>
      <p class="">{{video?.description}}</p>
    </section>

    <section
      v-if="recommendations.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 xl:gap-x-10 gap-y-2 xl:gap-y-5">
      <video-card v-for="video in recommendations"
                  :video="video"
                  size="s"
      />
    </section>
    <div v-if="isRecommendationNextPage" class="flex justify-center  my-5">
      <button
        class="cursor-pointer w-1/2 bg-red-300 py-2"
        @click="recommendationsNextPage">Voir plus</button>
    </div>
  </main>
</template>

<style scoped>

</style>