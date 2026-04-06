import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from '@/core/domain/activeTodo/entities/ActiveTodo';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { TodoDto } from '@/core/domain/activeTodo/dtos/out/TodoDto';

export type IGetActiveTodo = (args: { id: string }) => Promise<TodoDto>;

export const getActiveTodo: IGetActiveTodo = async (args: { id: string }) => {
  return wrappedFetch<TodoDto>(`${getConfig().API_URL}/active-todo/${args.id}`);
};

export const getQueryOptionsGetOneById = (args: { id: string }) =>
  queryOptions({
    queryKey: ['GET_TODO', args.id],
    queryFn: async (): Promise<ActiveTodo> => {
      const activeTodoDto = await getActiveTodo(args);
      return mapTodoDtoToActiveTodo(activeTodoDto);
    },
  });

export const GetOneByIdMethodImpl = (
  queryClient: QueryClient,
): IActiveTodoService['getOneById'] => {
  return ChimericQueryFactory({
    queryClient,
    getQueryOptions: getQueryOptionsGetOneById,
  });
};
