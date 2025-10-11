export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin } = useAuth();

  if (!isAdmin.value) {
    if (from.fullPath && from.fullPath !== to.fullPath) {
      return navigateTo(from.fullPath)
    }
    return navigateTo('/')
  }
});
