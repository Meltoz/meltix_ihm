<script setup lang="ts">

import { useDetailVideo } from '~/composables/video.query';
import {useQueryClient} from '@tanstack/vue-query';

const route = useRoute();

const slug = computed(() => route.params.slug);
const pageSize = 10;
const page = ref(0);
const search = ref("");

const {video} = useDetailVideo(slug);
const {allVideos, allVideoRefrech} = useAllVideos(page, pageSize, search);

onMounted(() => {
  allVideoRefrech();
})
</script>

<template>
<h1>{{video?.title}}</h1>
  <div class="grid grid-cols-5 gap-x-10 gap-y-5 mx-20">
    <video-card v-for="video in allVideos?.videos"
                :video="video"
                size="s"
    />
  </div>
</template>

<style scoped>

</style>