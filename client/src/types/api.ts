import { AxiosResponse } from 'axios';

export interface BaseRequest<OK extends boolean, D, M = undefined> {
  ok: OK;
  data: D;
  meta?: M;
}

export interface BasePaginationMetadata {
  total: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}

export interface BaseRequestPagination<D> extends BaseRequest<
  true,
  D,
  BasePaginationMetadata
> {}

export type PaginationFetchFunc = <T = unknown>(
  page?: number,
  limit?: number,
) => Promise<AxiosResponse<T>>;
