import { QueryClient, infiniteQueryOptions } from '@tanstack/react-query';
import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';
import { ChimericInfiniteQueryFactory } from '@chimeric/react-query';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { ArchivedTodoPageDto } from '@/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';

export type IGetAllArchivedTodos = (args: {
  pageParam: number;
}) => Promise<ArchivedTodoPageDto>;

export const getArchivedTodoPage: IGetAllArchivedTodos = async ({
  pageParam,
}) => {
  return wrappedFetch<ArchivedTodoPageDto>(
    `${getConfig().API_URL}/archived-todo?page=${pageParam}&limit=10`,
  );
};

export const getInfiniteQueryOptionsGetAll = () =>
  infiniteQueryOptions({
    queryKey: ['GET_ARCHIVED_TODO_LIST'],
    queryFn: ({ pageParam }) => getArchivedTodoPage({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });

export const GetAllMethodImpl = (
  queryClient: QueryClient,
): IArchivedTodoService['getAll'] => {
  return ChimericInfiniteQueryFactory({
    queryClient,
    getInfiniteQueryOptions: getInfiniteQueryOptionsGetAll,
  });
};
