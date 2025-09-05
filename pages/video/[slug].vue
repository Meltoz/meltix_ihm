<script setup lang="ts">
import { useDetailVideo } from '~/composables/video.query';

const route = useRoute();

const slug = computed(() => route.params.slug);
const pageSize = 10;

const {video} = useDetailVideo(slug);
const {recommendations,recommendationsNextPage ,isRecommendationNextPage} = useGetRecommandation(slug,  pageSize);
</script>

<template>
<h1>{{video?.title}}</h1>
  <div
    v-if="recommendations.length > 0"
    class="grid grid-cols-5 gap-x-10 gap-y-5 mx-20">
    <video-card v-for="video in recommendations"
                :video="video"
                size="s"
    />
    <button v-if="isRecommendationNextPage" @click="recommendationsNextPage">Voir plus</button>
  </div>
</template>

<style scoped>

</style>