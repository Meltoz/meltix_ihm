<script setup lang="ts">

import { useAddUser, useAllUsers, useDeleteUser } from '~/composables/query/user.query';
import { Plus } from 'lucide-vue-next';
import type { UserAdmin } from '~/models/userAdmin';
import EditUserModal from '~/components/modals/edit-user-modal.vue';
import DeleteModal from '~/components/modals/delete-modal.vue';

definePageMeta({
  searchPagination: true
});
useHead({
  title: 'Meltix | Gestion des comptes'
})

const {searchQuery, goToPage, currentPage} = useSearchPagination();
const pageSize = 20;
const {stopLoading, startLoading} = useLoading();
const {allUsers, isAllUsersSuccess, isAllUsersLoading, isAllUsersError} = useAllUsers(currentPage, pageSize, false, "role_ascending", searchQuery);
const {addUserAsync, isAddUserSuccess, isAddUserError} = useAddUser();
const {deleteUserAsync} = useDeleteUser();

const overlay = useOverlay();
const editModal = overlay.create(EditUserModal);
const deleteModal = overlay.create(DeleteModal);


const handleEditUserClick = async (event?: UserAdmin) => {

  const instance = editModal.open({
    user: event || {} as UserAdmin
  });

  const editUser = await instance.result;

  if(!editUser) return;

  if(event) {
    // logique update
  }
  else {
    await addUserAsync(editUser);
  }
}

const handleDeleteUserClick = async (user: UserAdmin) => {
    const instance = deleteModal.open({
      title:"Suppression d'un utilisateur",
      description: 'Supprimez ici un utilisateur',
      text: `Etes-vous sur de vouloir supprimer l'utilisateur ${user.pseudo} ?`
    });
    const shouldDelete = await instance.result;
    if(!shouldDelete) return;

    try{
      await deleteUserAsync(user.id);
    }catch {
      console.log('Error');
    }
}

watch(isAllUsersLoading, (loading) => {
  if (loading) startLoading();
  else stopLoading();
}, {immediate: true});
</script>

<template>
  <main class="md:mx-4 w-full space-y-5">
    <div v-if="isAllUsersSuccess">
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-0 mb-5">
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
      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 w-full">
        <admin-card
          v-for="user in allUsers.users"
          :key="user.id"
          @edit="handleEditUserClick(user)"
          @delete="handleDeleteUserClick(user)"
        >
          <div>
            <p class="text-xl">{{ user.pseudo }}</p>
            <p class="text-sm">{{ user.role }}</p>
          </div>
        </admin-card>
      </section>
      <section v-if="allUsers.totalCount > pageSize" class="flex justify-center my-8">
        <UPagination
          :default-page="(currentPage) +1"
          :items-per-page="pageSize"
          :page="currentPage+1"
          color="info"
          variant="ghost"
          :total="allUsers.totalCount"
          show-edges
          @update:page="(p) => goToPage(p-1)" />
      </section>
    </div>
    <div v-else-if="isAllUsersError"></div>
  </main>
</template>
