import { QueryClient, queryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AppStore, useAppSelector } from 'src/lib/store';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import {
  ActiveTodo,
  mapTodoDtoToActiveTodo,
} from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { saveAllActiveTodos } from '../activeTodoStore';
import { ChimericQueryWithManagedStoreFactory } from '@chimeric/react-query';
import { getConfig } from 'src/utils/getConfig';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';

export type IGetAllActiveTodos = () => Promise<TodoListDto>;

export const getTodoList: IGetAllActiveTodos = async () => {
  return wrappedFetch<TodoListDto>(`${getConfig().API_URL}/active-todo`);
};

export const getQueryOptionsGetAll = (appStore: AppStore) => () =>
  queryOptions({
    queryKey: ['GET_TODO_LIST'],
    queryFn: async () => {
      const todoListDto = await getTodoList();
      appStore.dispatch(
        saveAllActiveTodos(todoListDto.list.map(mapTodoDtoToActiveTodo)),
      );
    },
  });

export const GetAllMethodImpl = (
  appStore: AppStore,
  queryClient: QueryClient,
): IActiveTodoService['getAll'] => {
  return ChimericQueryWithManagedStoreFactory(queryClient, {
    getQueryOptions: getQueryOptionsGetAll(appStore),
    getFromStore: () =>
      Object.values(appStore.getState().todo.activeTodos.dict).filter(
        Boolean,
      ) as ActiveTodo[],
    useFromStore: () => {
      const activeTodoListDictionary = useAppSelector(
        (state) => state.todo.activeTodos.dict,
      );
      return useMemo(
        () =>
          Object.values(activeTodoListDictionary).filter(
            Boolean,
          ) as ActiveTodo[],
        [activeTodoListDictionary],
      );
    },
  });
};
