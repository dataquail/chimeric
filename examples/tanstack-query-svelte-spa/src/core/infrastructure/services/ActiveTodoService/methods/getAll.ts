import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { ChimericQueryFactory } from '@chimeric/svelte-query';
import { queryOptions } from '@tanstack/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const GET_ALL_QUERY_KEY = ['GET_TODO_LIST'] as const;

export const GetAllMethodImpl: IActiveTodoService['getAll'] =
  ChimericQueryFactory({
    queryClient,
    getQueryOptions: () =>
      queryOptions({
        queryKey: [...GET_ALL_QUERY_KEY],
        queryFn: async (): Promise<ActiveTodo[]> => {
          const todoListDto = await wrappedFetch<TodoListDto>(
            `${getConfig().API_URL}/active-todo`,
          );
          return todoListDto.list.map(mapTodoDtoToActiveTodo);
        },
      }),
  });
