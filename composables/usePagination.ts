import { useRoute, useRouter } from 'vue-router'

export function usePagination() {
  const route = useRoute()
  const router = useRouter()

  // page avec getter/setter
  const page = computed({
    get: () => Number(route.query.page ?? 0),
    set: (val: number) => {
      router.push({
        query: {
          ...route.query,
          page: val
        }
      })
    }
  })

  // recherche avec getter/setter
  const q = computed({
    get: () => route.query.q ?? '',
    set: (val: string) => {
      const query: Record<string, any> = { ...route.query, q: val || undefined }

      // si aucune page spécifiée dans l’URL → repartir à 0
      if (!('page' in route.query)) {
        query.page = 0
      }

      router.push({ query })
    }
  })

  return { page, q }
}