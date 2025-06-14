import { queryOptions } from '@tanstack/react-query';
import { mapSavedForLaterTodoDtoToSavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { getConfig } from 'src/utils/getConfig';
import { TodoListDto } from 'src/core/domain/activeTodo/dtos/out/TodoListDto';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { SavedForLaterTodoListDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoListDto';
import { queryClient } from 'src/core/global/queryClient';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

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

export const GetAllMethodImpl: ISavedForLaterTodoService['getAll'] =
  ChimericQueryFactory(queryClient, getQueryOptionsGetAll);
