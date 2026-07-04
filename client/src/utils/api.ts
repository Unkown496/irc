import { AxiosInstance, Axios, AxiosResponse } from 'axios';
import { BaseRequestPagination } from 'types/api';

export const withPaginationParams = (page: number = 1, limit: number = 10) => ({
  params: { page, limit },
});

export const getAll = async <T>(
  request: (
    page: number,
    limit: number,
  ) => Promise<AxiosResponse<BaseRequestPagination<T>>>,
) => {
  const {
    data: { data, ok, meta },
  } = await request(1, 1);

  if (!ok) return;
  if (!meta) return;

  const {
    data: { data: dataAll, ok: okAll },
  } = await request(1, meta.total);

  if (!okAll) return;

  return dataAll;
};
