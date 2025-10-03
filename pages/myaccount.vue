<script setup lang="ts">
const {user, logout} = useAuth();

const handleLogout = async () => {
  try{
    await logout()
    navigateTo('/login');
  }
  catch (err){
    console.log(err)
  }
}
</script>

<template>
<main class="mx-4 w-full">
  <h2 class="text-2xl">Mon compte</h2>
  <div class="grid grid-cols-2 text-xl my-5">
    <p class="">pseudo : <span class="italic">{{user.pseudo}}</span></p>
    <p class="">Role : <span class="italic">{{user.role}}</span></p>
  </div>
  <UButton color="error" variant="outline" @click="handleLogout">Déconnexion</UButton>
</main>
</template>