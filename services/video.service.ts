import type { Video } from '~/models/video';

const endpoint ="/video";


export const getAllVideos = async (pageIndex: number, pageSize: number, search:string): Promise<{videos: Video[], totalCount: number}> => {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });

  if(search) {
    params.append('search', search);
  }
  const response = await useFetchCustomWithCount<Video[]>(`${endpoint}/getAllvideos?${params.toString()}`,{
    method: HTTP_METHODS.GET,
  });

  return {
    videos: response.data,
    totalCount: response.totalCount
  }

}