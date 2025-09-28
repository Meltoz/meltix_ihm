import type { Video, VideoCard, VideoEdit } from '~/models/video';

const endpoint = '/video';

/*
 * Request to backend all video
 */
export const getAllVideos = async (
  pageIndex: number,
  pageSize: number,
  sort: string,
  search: string
): Promise<{ videos: VideoCard[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
    sort: sort,
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

export const updateVideo = async (video: VideoEdit): Promise<Video> => {
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

export const getUncategorisedVideos = async (
  pageIndex: number,
  pageSize: number,
  sort: string,
  search: string
): Promise<{ videos: Video[]; totalCount: number }> => {
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
    sort: sort,
  });
  if (search !== '') {
    params.append('search', search);
  }

  const response = await useFetchCustomWithCount<Video[]>(
    `${endpoint}/GetUnCategorisedVideos?${params.toString()}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

  return {
    videos: response.data,
    totalCount: response.totalCount,
  };
};

export const getLatest = async (
  pageIndex: number,
  pageSize: number
): Promise<{ videos: VideoCard[]; totalCount: number }> => {
  const days = 7;
  const params = new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString(),
    days: days.toString(),
  });

  const response = await useFetchCustomWithCount<VideoCard[]>(
    `${endpoint}/LatestVideos?${params.toString()}`,
    {
      method: HTTP_METHODS.GET,
    }
  );

  return {
    videos: response.data,
    totalCount: response.totalCount,
  };
};

export const requestScanVideo = async (): Promise<void> => {
  return await useFetchCustom(`${endpoint}/Scan`, {
    method: HTTP_METHODS.GET,
  });
};
