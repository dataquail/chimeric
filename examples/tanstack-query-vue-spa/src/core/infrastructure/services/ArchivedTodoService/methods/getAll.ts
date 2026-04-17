import { ChimericInfiniteQueryFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { ArchivedTodoPageDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';

export const GET_ALL_ARCHIVED_QUERY_KEY = ['GET_ARCHIVED_TODO_LIST'] as const;

export const getInfiniteQueryOptionsGetAll = () => ({
  queryKey: [...GET_ALL_ARCHIVED_QUERY_KEY],
  queryFn: async ({ pageParam }: { pageParam: number }) => {
    return wrappedFetch<ArchivedTodoPageDto>(
      `${getConfig().API_URL}/archived-todo?page=${pageParam}&limit=10`,
    );
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage: ArchivedTodoPageDto) => lastPage.next_cursor,
});

export const GetAllMethodImpl = ChimericInfiniteQueryFactory<
  ArchivedTodoPageDto,
  number
>({
  queryClient,
  getInfiniteQueryOptions: getInfiniteQueryOptionsGetAll,
});
