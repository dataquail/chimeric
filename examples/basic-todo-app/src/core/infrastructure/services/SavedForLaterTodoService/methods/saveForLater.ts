import { ChimericMutationFactory } from '@chimeric/react-query';
import { getQueryOptionsGetAll as getQueryOptionsGetAllActiveTodos } from '../../ActiveTodoService/methods/getAll';
import { getQueryOptionsGetOneById as getQueryOptionsGetOneByIdActiveTodo } from '../../ActiveTodoService/methods/getOneById';
import { getQueryOptionsGetOneById } from './getOneById';
import { getQueryOptionsGetAll } from './getAll';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { queryClient } from 'src/core/global/queryClient';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

export type ISaveActiveTodoForLater = (
  args: SaveForLaterBody,
) => Promise<{ id: string }>;

export const saveActiveTodoForLater: ISaveActiveTodoForLater = async (
  savedForLaterBody,
) => {
  return wrappedFetch<{ id: string }>(
    `${getConfig().API_URL}/saved-for-later-todo/save-for-later`,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savedForLaterBody),
    },
  );
};

export const SaveForLaterMethodImpl: ISavedForLaterTodoService['saveForLater'] =
  ChimericMutationFactory(queryClient, {
    mutationFn: saveActiveTodoForLater,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(data).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAllActiveTodos().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneByIdActiveTodo(data).queryKey,
      });
    },
  });
