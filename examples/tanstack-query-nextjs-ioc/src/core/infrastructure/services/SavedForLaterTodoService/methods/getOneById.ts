import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { ISavedForLaterTodoService } from '@/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { mapSavedForLaterTodoDtoToSavedForLaterTodo } from '@/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { TodoDto } from '@/core/domain/activeTodo/dtos/out/TodoDto';
import { SavedForLaterTodoDto } from '@/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';

export type IGetSavedForLaterTodo = (
  id: string,
) => Promise<SavedForLaterTodoDto>;

export const getSavedForLaterTodo: IGetSavedForLaterTodo = async (
  id: string,
) => {
  return wrappedFetch<TodoDto>(
    `${getConfig().API_URL}/saved-for-later-todo/${id}`,
  );
};

export const getQueryOptionsGetOneById = (id: string) =>
  queryOptions({
    queryKey: ['GET_SAVED_FOR_LATER_TODO', id],
    queryFn: async () => {
      const savedForLaterTodoDto = await getSavedForLaterTodo(id);
      return mapSavedForLaterTodoDtoToSavedForLaterTodo(savedForLaterTodoDto);
    },
  });

export const GetOneByIdMethodImpl = (
  queryClient: QueryClient,
): ISavedForLaterTodoService['getOneById'] => {
  return ChimericQueryFactory({
    queryClient,
    getQueryOptions: getQueryOptionsGetOneById,
  });
};
