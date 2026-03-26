import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ISavedForLaterTodoService } from '@/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { mapSavedForLaterTodoDtoToSavedForLaterTodo } from '@/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { getConfig } from '@/utils/getConfig';
import { TodoListDto } from '@/core/domain/activeTodo/dtos/out/TodoListDto';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { SavedForLaterTodoListDto } from '@/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoListDto';

export type IGetAllSavedForLaterTodos = () => Promise<SavedForLaterTodoListDto>;

export const getSavedForLaterTodoList: IGetAllSavedForLaterTodos = async () => {
  return wrappedFetch<TodoListDto>(
    `${getConfig().API_URL}/saved-for-later-todo`,
  );
};

export const getQueryOptionsGetAll = () =>
  queryOptions({
    queryKey: ['GET_SAVED_FOR_LATER_TODO_LIST'],
    queryFn: async () => {
      const savedForLaterTodoListDto = await getSavedForLaterTodoList();
      return savedForLaterTodoListDto.list.map(
        mapSavedForLaterTodoDtoToSavedForLaterTodo,
      );
    },
  });

export const GetAllMethodImpl = (
  queryClient: QueryClient,
): ISavedForLaterTodoService['getAll'] => {
  return ChimericQueryFactory({
    queryClient,
    getQueryOptions: getQueryOptionsGetAll,
  });
};
