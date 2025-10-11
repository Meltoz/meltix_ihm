<script setup lang="ts">

import { useUncategorisedVideos } from '~/composables/query/video.query';
import { useAllCategories } from '~/composables/query/category.query';
import { useAllTags } from '~/composables/query/tags.query';
import { useAllUsers } from '~/composables/query/user.query';

useHead({
  title: 'Meltix | Administration'
})

const pageIndex = 1;
const pageSize = 1;
const search = '';
const {user} = useAuth();
const {uncategorisedVideos, isUncategorisedVideoLoading } = useUncategorisedVideos(pageIndex, pageSize, 'title_ascending', search);
const { allCategories, isAllCategoriesLoading } = useAllCategories(pageIndex, pageSize, search);
const {allTags, isAllTagsSuccess, isAllTagsLoading} = useAllTags(pageIndex, pageSize, search);
const {allUsers, isAllUsersLoading} = useAllUsers(pageIndex, pageSize, false, "role_ascending", search);

const {startLoading, stopLoading} = useLoading();

watchEffect(() => {
  if(isAllTagsLoading.value || isUncategorisedVideoLoading.value || isAllCategoriesLoading.value || isAllUsersLoading.value)
    startLoading();
  else
    stopLoading();
})
</script>

<template>
<main class="w-full ">
  <h2 class="text-2xl md:text-3xl font-medium">Bienvenue <span class="italic">{{user.pseudo}}</span></h2>
  <section class="grid grid-cols-1 md:grid-cols-2 gap-10 my-10 md:mx-2 font-inter">
    <article
      class="border p-2 space-y-5 rounded-2xl cursor-pointer hover:bg-gray-200  dark:hover:bg-gray-400 dark:hover:text-black transition-colors duration-300"
    @click="navigateTo('admin/videos')">
      <h3 class="text-xl font-inter">Vidéos</h3>
      <p>Vous avez <span class="font-bold">{{uncategorisedVideos?.totalCount}} vidéos</span> en attente de catégorisation</p>
      <p class="italic text-center text-sm">Cliquer ici pour catégoriser les vidéos</p>
    </article>
    <article
      class="border p-2 space-y-5 rounded-2xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-400 dark:hover:text-black transition-colors duration-300"
      @click="navigateTo('admin/categories')">
      <h3 class="text-xl font-inter">Catégories</h3>
      <p>Il y a actuellement <span class="font-bold">{{allCategories?.totalCount}} catégories.</span></p>
      <p class="italic text-center text-sm">Cliquer ici pour gérer les catégories</p>
    </article>
    <article
      class="border p-2 space-y-5 rounded-2xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-400 dark:hover:text-black transition-colors duration-300"
    @click="navigateTo('admin/tags')">
      <h3 class="text-xl font-inter">Tags</h3>
      <p>Il y a actuellement <span class="font-bold">{{allTags?.totalCount}} tags.</span></p>
      <p class="italic text-center text-sm">Cliquer ici pour gérer les tags</p>
    </article>
    <article
      class="border p-2 space-y-5 rounded-2xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-400 dark:hover:text-black transition-colors duration-300"
      @click="navigateTo('/admin/accounts')"
    >
      <h3 class="text-xl font-inter">Comptes</h3>
      <p>Il y a actuellement <span class="font-bold">{{allUsers?.totalCount}} utilisateurs.</span></p>
      <p class="italic text-center text-sm">Cliquer ici pour gérer les utilisateurs</p>
    </article>
  </section>
</main>
</template>