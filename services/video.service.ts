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

  return await useFetchCustom<Video>(
    `${endpoint}/getDetail?${params.toString()}`,
    HTTP_METHODS.GET
  );
};

export const getRecommendations = async (
  slug: string,
  pageIndex: number,
  pageSize: number
): Promise<{
  recommendations: VideoCard[];
  totalCount: number;
}> => {
  const params = new URLSearchParams({
    slug: slug,
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await useFetchCustomWithCount<VideoCard[]>(
    `${endpoint}/recommendations?${params.toString()}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

  return {
    recommendations: response.data,
    totalCount: response.totalCount,
  };
};

export const updateVideo = async (video: Video): Promise<Video> => {
  const formData = new FormData();
  console.log(video);

  // On mappe les propriétés de l'objet Video dans le FormData
  Object.entries(video).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  return await useFetchCustom<Video>(`${endpoint}/updateVideo`, {
    method: HTTP_METHODS.PATCH,
    body: formData,
  });
};
