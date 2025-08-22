import { ofetch } from 'ofetch';

export const useFetchCustomWithCount = async <T = unknown>(
  url: string,
  options: any
): Promise<{ data: T; totalCount?: number }> => {
  const config = useRuntimeConfig();
  const accessToken = useCookie('access_token');

  const headers: HeadersInit = {};

  if (accessToken.value) {
    headers.Authorization = `Bearer ${accessToken.value}`;
  }

  const response = await ofetch.raw<T>(url, {
    baseURL: `${config.public.apiBaseUrl}/api`,
    ...options,
    headers,
  });

  const totalCountHeader = response.headers.get('X-Total-Count');
  return {
    data: response._data,
    totalCount: totalCountHeader ? parseInt(totalCountHeader, 10) : undefined,
  };
};

export const useFetchCustom = async <T = unknown>(url: string, options: any): Promise<T> => {
  const config = useRuntimeConfig();
  const accessToken = useCookie('access_token');

  const headers: HeadersInit = {};

  if (accessToken.value) {
    headers.Authorization = `Bearer ${accessToken.value}`;
  }

  const response = await ofetch.raw<T>(url, {
    baseURL: `${config.public.apiBaseUrl}/api`,
    ...options,
    headers,
  });

  return response._data;
};
