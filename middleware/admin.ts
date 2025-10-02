export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.path.includes('/admin')) return;

  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return navigateTo('/');
  }
});
