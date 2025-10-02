<script setup lang="ts">

const {login, isLoginIn} = useAuth();

const pseudo = ref("");
const password = ref("");

const handleLogin = () => {
  try{
    login(pseudo.value, password.value);
  }
  catch (error) {
    console.log(error);
  }
}

watch(isLoginIn, (val) => {
  console.log('valeur isLoginIn', val);
  if (val)
    navigateTo("/")
}, {immediate: true});
</script>

<template>
  <div>
    <h2>Login</h2>
    <fieldset>
      <label>Pseudo</label>
      <input v-model="pseudo">
    </fieldset>
    <fieldset>
      <label>Password</label>
      <input v-model="password">
    </fieldset>
    <UButton color="info" label="Connexion" @click="handleLogin"/>
  </div>

</template>

<style scoped>

</style>