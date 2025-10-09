export default defineNuxtRouteMiddleware((to, from) => {
  const onboarding = localStorage.getItem('onboarding');
  console.log('middleware on boarding');

  if (onboarding === 'false') {
    console.log('redirect to onboarding');
    return navigateTo('/onboarding');
  }
  console.log('middleware on boarding finish');
});
