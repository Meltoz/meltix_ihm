import type { Video, VideoCard } from '~/models/video';

const endpoint = '/video';

/*
 * Request to backend all video
 */
export const getAllVideos = async (
  pageIndex: number,
  pageSize: number,
  search: string
): Promise<{ videos: VideoCard[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });

  if (search !== '') {
    params.append('search', search);
  }
  const response = await useFetchCustomWithCount<VideoCard[]>(
    `${endpoint}/getAllvideos?${params.toString()}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

  return {
    videos: response.data,
    totalCount: response.totalCount,
  };
};

export const getDetail = async (slug: string): Promise<Video> => {
  const params = new URLSearchParams({
    slug: slug,
  });

  return await useFetchCustom<Video>(`${endpoint}/getVideo?${params.toString()}`, HTTP_METHODS.GET);
};
