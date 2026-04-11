import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { ChimericQueryFactory } from '@chimeric/svelte-query';
import { queryOptions } from '@tanstack/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const GetOneByIdMethodImpl: IActiveTodoService['getOneById'] =
  ChimericQueryFactory({
    queryClient,
    getQueryOptions: ({ id }: { id: string }) =>
      queryOptions({
        queryKey: ['GET_TODO_BY_ID', id],
        queryFn: async (): Promise<ActiveTodo> => {
          const todoDto = await wrappedFetch<TodoDto>(
            `${getConfig().API_URL}/todo/${id}`,
          );
          return mapTodoDtoToActiveTodo(todoDto);
        },
      }),
  });
