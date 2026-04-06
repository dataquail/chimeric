import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from '@/core/domain/activeTodo/entities/ActiveTodo';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { ActiveTodosFetchedEvent } from '@/core/domain/activeTodo/events/ActiveTodosFetchedEvent';
import { getConfig } from '@/utils/getConfig';
import { TodoListDto } from '@/core/domain/activeTodo/dtos/out/TodoListDto';
import { wrappedFetch } from '@/utils/network/wrappedFetch';

export type IGetAllActiveTodos = () => Promise<TodoListDto>;

export const getTodoList: IGetAllActiveTodos = async () => {
  return wrappedFetch<TodoListDto>(`${getConfig().API_URL}/active-todo`);
};

export const GET_ALL_QUERY_KEY = ['GET_TODO_LIST'] as const;

export const getQueryOptionsGetAll = () =>
  queryOptions({
    queryKey: [...GET_ALL_QUERY_KEY],
    queryFn: async (): Promise<ActiveTodo[]> => {
      const todoListDto = await getTodoList();
      return todoListDto.list.map(mapTodoDtoToActiveTodo);
    },
  });

export const GetAllMethodImpl = (
  queryClient: QueryClient,
  applicationEventEmitter: IApplicationEventEmitter,
): IActiveTodoService['getAll'] => {
  const getQueryOptions = () =>
    queryOptions({
      queryKey: [...GET_ALL_QUERY_KEY],
      queryFn: async (): Promise<ActiveTodo[]> => {
        const todoListDto = await getTodoList();
        const activeTodos = todoListDto.list.map(mapTodoDtoToActiveTodo);
        applicationEventEmitter.emit(
          new ActiveTodosFetchedEvent({
            ids: activeTodos.map((todo) => todo.id),
          }),
        );
        return activeTodos;
      },
    });

  return ChimericQueryFactory({
    queryClient,
    getQueryOptions,
  });
};
