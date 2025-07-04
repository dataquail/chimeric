import { ChimericMutationFactory } from '@chimeric/react-query';
import { getQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetOneById } from './getOneById';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { SavedForLaterTodoDeletedEvent } from 'src/core/domain/savedForLaterTodo/events/SavedForLaterTodoDeletedEvent';
import { queryClient } from 'src/core/global/queryClient';
import { applicationEventEmitter } from 'src/core/global/applicationEventEmitter';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

export type IDeleteSavedForLaterTodo = (args: {
  id: string;
}) => Promise<{ message: string }>;

export const deleteSavedForLaterTodo: IDeleteSavedForLaterTodo = async (args: {
  id: string;
}) => {
  return wrappedFetch<{ message: string }>(
    `${getConfig().API_URL}/saved-for-later-todo/${args.id}`,
    {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
};

export const DeleteOneMethodImpl: ISavedForLaterTodoService['deleteOne'] =
  ChimericMutationFactory(queryClient, {
    mutationFn: async (args: { id: string }) => {
      await deleteSavedForLaterTodo(args);
    },
    onSuccess: async (_data, args) => {
      applicationEventEmitter.emit(
        new SavedForLaterTodoDeletedEvent({ id: args.id }),
      );
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(args).queryKey,
      });
    },
  });
