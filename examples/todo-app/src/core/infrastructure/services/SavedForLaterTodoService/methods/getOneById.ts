import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { mapSavedForLaterTodoDtoToSavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { MakeChimericQuery } from 'src/utils/domain/makeChimericQuery';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';
import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';

export type IGetSavedForLaterTodo = (args: {
  id: string;
}) => Promise<SavedForLaterTodoDto>;

export const getSavedForLaterTodo: IGetSavedForLaterTodo = async (args: {
  id: string;
}) => {
  return wrappedFetch<TodoDto>(
    `${getConfig().API_URL}/saved-for-later-todo/${args.id}`,
  );
};

export const getQueryOptionsGetOneById = (args: { id: string }) =>
  queryOptions({
    queryKey: ['GET_SAVED_FOR_LATER_TODO', args.id],
    queryFn: async () => {
      const savedForLaterTodoDto = await getSavedForLaterTodo(args);
      return mapSavedForLaterTodoDtoToSavedForLaterTodo(savedForLaterTodoDto);
    },
  });

export const GetOneByIdMethodImpl = (
  queryClient: QueryClient,
): ISavedForLaterTodoService['getOneById'] => {
  return MakeChimericQuery(queryClient)({
    getQueryOptions: getQueryOptionsGetOneById,
    errorHelpers: {},
  });
};
