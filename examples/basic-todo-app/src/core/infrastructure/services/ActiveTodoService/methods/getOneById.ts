import { queryOptions } from '@tanstack/react-query';
import { useAppSelector } from 'src/lib/store';
import { saveActiveTodo } from '../activeTodoStore';
import { mapTodoDtoToActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { ChimericQueryWithManagedStoreFactory } from '@chimeric/react-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';
import { appStore } from 'src/core/global/appStore';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export type IGetActiveTodo = (args: { id: string }) => Promise<TodoDto>;

export const getActiveTodo: IGetActiveTodo = async (args: { id: string }) => {
  return wrappedFetch<TodoDto>(`${getConfig().API_URL}/active-todo/${args.id}`);
};

export const getQueryOptionsGetOneById = (args: { id: string }) =>
  queryOptions({
    queryKey: ['GET_TODO', args.id],
    queryFn: async () => {
      const activeTodoDto = await getActiveTodo(args);
      appStore.dispatch(saveActiveTodo(mapTodoDtoToActiveTodo(activeTodoDto)));
    },
  });

export const GetOneByIdMethodImpl: IActiveTodoService['getOneById'] =
  ChimericQueryWithManagedStoreFactory({
    queryClient,
    getFromStore: (args) => appStore.getState().todo.activeTodos.dict[args.id],
    useFromStore: (args) =>
      useAppSelector((state) => state.todo.activeTodos.dict[args.id]),
    getQueryOptions: getQueryOptionsGetOneById,
  });
