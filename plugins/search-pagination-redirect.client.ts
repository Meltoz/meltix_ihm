export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to, from) => {
    const supportsSearchPagination = to.meta?.searchPagination === true

    const hasSearchOrPageParams = to.query.page !== undefined || to.query.q !== undefined

    if (!supportsSearchPagination && hasSearchOrPageParams) {
      const redirectQuery:any = {}
      if (to.query.q) redirectQuery.q = to.query.q

      router.push({
        path: '/',
        query: redirectQuery
      })
    }
  })
})