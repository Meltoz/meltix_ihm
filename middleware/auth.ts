export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoginIn } = useAuth();
  console.log('middleware auth');
  if (!isLoginIn.value) {
    return navigateTo('/login');
  }
});
