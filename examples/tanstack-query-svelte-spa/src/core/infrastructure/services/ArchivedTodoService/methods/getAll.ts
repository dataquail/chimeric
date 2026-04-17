import { ChimericInfiniteQueryFactory } from '@chimeric/svelte-query';
import { infiniteQueryOptions } from '@tanstack/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { ArchivedTodoPageDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { queryClient } from 'src/core/global/queryClient';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';

export const GET_ALL_ARCHIVED_QUERY_KEY = ['GET_ARCHIVED_TODO_LIST'];

export const getInfiniteQueryOptionsGetAll = () =>
  infiniteQueryOptions({
    queryKey: [...GET_ALL_ARCHIVED_QUERY_KEY],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      wrappedFetch<ArchivedTodoPageDto>(
        `${getConfig().API_URL}/archived-todo?page=${pageParam}&limit=10`,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ArchivedTodoPageDto) => lastPage.next_cursor,
  });

export const GetAllMethodImpl: IArchivedTodoService['getAll'] =
  ChimericInfiniteQueryFactory({
    queryClient,
    getInfiniteQueryOptions: getInfiniteQueryOptionsGetAll,
  });
