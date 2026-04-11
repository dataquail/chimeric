import { queryOptions, type FetchQueryOptions } from '@tanstack/vue-query';
import { ChimericQueryFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { fakeApi } from 'src/utils/fakeApi';
import { ITodoService } from 'src/core/domain/todo/ports/ITodoService';
import { Todo } from 'src/core/domain/todo/entities/Todo';

export const GET_ALL_QUERY_KEY: string[] = ['GET_TODO_LIST'];

export const getQueryOptionsGetAll = (): FetchQueryOptions<Todo[], Error, Todo[], string[]> =>
  queryOptions({
    queryKey: GET_ALL_QUERY_KEY,
    queryFn: async (): Promise<Todo[]> => {
      return fakeApi.getTodos();
    },
  });

export const GetAllMethodImpl: ITodoService['getAll'] = ChimericQueryFactory({
  queryClient,
  getQueryOptions: getQueryOptionsGetAll,
});
