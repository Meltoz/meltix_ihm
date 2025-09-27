<script setup lang="ts">

import { useAllUsers } from '~/composables/query/user.query';
import { Plus } from 'lucide-vue-next';
import type { UserAdmin } from '~/models/userAdmin';

definePageMeta({
  searchPagination: true
});
useHead({
  title: 'Meltix | Gestion des comptes'
})

const {searchQuery, goToPage, currentPage} = useSearchPagination();
const {stopLoading, startLoading} = useLoading();
const {allUsers, isAllUsersSuccess, isAllUsersLoading, isAllUsersError} = useAllUsers(currentPage, 20, false, "pseudo_ascending", searchQuery);

const overlay = useOverlay();


const handleEditUserClick = (user?: UserAdmin) => {

}

const handleDeleteUserClick = (user: UserAdmin) => {

}

watch(isAllUsersLoading, (loading) => {
  if (loading) startLoading();
  else stopLoading();
}, {immediate: true});
</script>

<template>
<main class="mx-4 w-full space-y-5">
  <div v-if="isAllUsersSuccess">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl md:text-3xl font-medium">Tous les comptes</h2>
      <UButton
        color="info"
        class="w-full md:w-fit px-8 py-2 cursor-pointer flex flex-row justify-center"
        @click="handleEditUserClick(null)"
      >
        <Plus />
        Compte
      </UButton>
    </div>
    <div class="grid grid-cols-5 gap-5 w-full">
      <admin-card v-for="user in allUsers.users"
                  :key="user.id"
                  @edit="handleEditUserClick(user)"
                  @delete="handleDeleteUserClick(user)"
      >
        <div>
         <p class="text-xl">{{user.pseudo}}</p>
          <p class="text-sm">{{user.role}}</p>
        </div>
      </admin-card>
    </div>
  </div>
  <div v-else-if="isAllUsersError">

  </div>
</main>
</template>
