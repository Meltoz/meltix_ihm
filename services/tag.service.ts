const endpoint = 'tag';
export const searchTags = async (search: string): Promise<string[]> => {
  const params = new URLSearchParams({
    searchTerm: search,
  });

  return await useFetchCustom<string[]>(`${endpoint}/search?${params}`, {
    method: HTTP_METHODS.GET,
  });
};
