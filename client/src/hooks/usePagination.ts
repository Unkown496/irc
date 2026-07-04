import { useCallback, useState } from 'react';

type UsePaginationReturn = [
  number,
  number,
  Record<'increment' | 'decrement', VoidFunction>,
];

interface UsePaginationParams {
  page?: number;
  limit?: number;
}

export default function usePagination(
  params?: UsePaginationParams,
): UsePaginationReturn {
  const { page: defaultPage, limit: defaultLimit } = params ?? {};

  const [page, setPage] = useState(defaultPage ?? 1),
    [limit, _] = useState(defaultLimit ?? 10);

  const increment = useCallback(() => {
      setPage(page + 1);
    }, [page, setPage]),
    decrement = useCallback(() => {
      setPage(page - 1);
    }, [page, setPage]);

  return [page, limit, { increment, decrement }];
}
