export const useSearchPagination = () => {
  const router = useRouter();
  const route = useRoute();

  const currentPage = ref(parseInt(route.query.page) || 0);
  const searchQuery = ref<string>(route.query.q || '');

  // Fonction pour mettre à jour l'URL
  const updateURL = (page: number = currentPage.value, query = searchQuery.value) => {
    const newQuery = { ...route.query };

    if (page > 0) {
      newQuery.page = page;
    } else {
      delete newQuery.page;
    }

    if (query) {
      newQuery.q = query;
    } else {
      delete newQuery.q;
    }

    router.push({
      path: route.path,
      query: newQuery,
    });
  };

  // Pagination
  const goToPage = (page: number) => {
    currentPage.value = page;
    updateURL(page, searchQuery.value);
  };

  // Recherche
  const search = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 0;
    updateURL(0, query);
  };

  // Watcher pour synchroniser avec les changements d'URL
  watch(
    () => route.query,
    (newQuery) => {
      currentPage.value = parseInt(newQuery.page) || 0;
      searchQuery.value = newQuery.q || '';
    }
  );

  return {
    currentPage: readonly(currentPage),
    searchQuery: readonly(searchQuery),
    goToPage,
    search,
    updateURL,
  };
};
