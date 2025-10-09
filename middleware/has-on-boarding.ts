export default defineNuxtRouteMiddleware((to, from) => {
  const onboarding = localStorage.getItem('onboarding');

  if (onboarding === 'false') {
    return navigateTo('/onboarding');
  }

  if (onboarding === 'false') return navigateTo('/onboarding');
});
