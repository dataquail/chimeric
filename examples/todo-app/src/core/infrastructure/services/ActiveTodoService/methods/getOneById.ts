import { QueryClient, queryOptions } from '@tanstack/react-query';
import { AppStore, useAppSelector } from 'src/lib/store';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { saveActiveTodo } from '../activeTodoStore';
import { mapTodoDtoToActiveTodo } from 'src/core/domain/activeTodo/entities/ActiveTodo';
import { MakeChimericQueryWithManagedStore } from 'src/utils/domain/makeChimericQueryWithManagedStore';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';

export type IGetActiveTodo = (args: { id: string }) => Promise<TodoDto>;

export const getActiveTodo: IGetActiveTodo = async (args: { id: string }) => {
  return wrappedFetch<TodoDto>(`${getConfig().API_URL}/active-todo/${args.id}`);
};

export const getQueryOptionsGetOneById = (args: { id: string }) =>
  queryOptions({
    queryKey: ['GET_TODO', args.id],
  });

export const GetOneByIdMethodImpl = (
  appStore: AppStore,
  queryClient: QueryClient,
): IActiveTodoService['getOneById'] => {
  return MakeChimericQueryWithManagedStore(queryClient)({
    getQueryOptions: (args: { id: string }) =>
      queryOptions({
        ...getQueryOptionsGetOneById(args),
        queryFn: async () => {
          const activeTodoDto = await getActiveTodo(args);
          appStore.dispatch(
            saveActiveTodo(mapTodoDtoToActiveTodo(activeTodoDto)),
          );
        },
      }),
    errorHelpers: {},
    getFromStore: (args) => {
      const activeTodo = appStore.getState().todo.activeTodos.dict[args.id];
      return activeTodo;
    },
    useFromStore: (args) => {
      return useAppSelector((state) => state.todo.activeTodos.dict[args.id]);
    },
  });
};
