import {
  ArchivedTodo,
  mapArchivedTodoDtoToArchivedTodo,
} from 'src/core/domain/archivedTodo/entities/ArchivedTodo';
import { ChimericQueryFactory } from '@chimeric/svelte-query';
import { queryOptions } from '@tanstack/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { ArchivedTodoPageDto } from 'src/core/domain/archivedTodo/dtos/out/ArchivedTodoPageDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { queryClient } from 'src/core/global/queryClient';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';

export const GET_ALL_ARCHIVED_QUERY_KEY = ['GET_ARCHIVED_TODO_LIST'] as const;

export const GetAllMethodImpl: IArchivedTodoService['getAll'] =
  ChimericQueryFactory({
    queryClient,
    getQueryOptions: () =>
      queryOptions({
        queryKey: [...GET_ALL_ARCHIVED_QUERY_KEY],
        queryFn: async (): Promise<ArchivedTodo[]> => {
          const page = await wrappedFetch<ArchivedTodoPageDto>(
            `${getConfig().API_URL}/archived-todo?page=0&limit=100`,
          );
          return page.list.map(mapArchivedTodoDtoToArchivedTodo);
        },
      }),
  });
