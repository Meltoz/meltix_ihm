export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoginIn } = useAuth();
  if (!isLoginIn.value) {
    return navigateTo('/login');
  }
});
