export default defineNuxtRouteMiddleware((to, from) => {
  const onboarding = localStorage.getItem('onboarding');
  console.log("middleware")

  if(onboarding === 'false')
    return navigateTo('/onboarding')
})