import { queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from '@chimeric/react-query';
import { mapSavedForLaterTodoDtoToSavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { TodoDto } from 'src/core/domain/activeTodo/dtos/out/TodoDto';
import { SavedForLaterTodoDto } from 'src/core/domain/savedForLaterTodo/dtos/out/SavedForLaterTodoDto';
import { queryClient } from 'src/core/global/queryClient';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

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

export const GetOneByIdMethodImpl: ISavedForLaterTodoService['getOneById'] =
  ChimericQueryFactory(queryClient, getQueryOptionsGetOneById);
