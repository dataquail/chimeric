import { QueryClient } from '@tanstack/react-query';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { getQueryOptionsGetAll as getQueryOptionsGetAllActiveTodos } from '../../ActiveTodoService/methods/getAll';
import { getQueryOptionsGetOneById as getQueryOptionsGetOneByIdActiveTodo } from '../../ActiveTodoService/methods/getOneById';
import { getQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetOneById } from './getOneById';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';
import { AppStore } from 'src/lib/store';

export type IActivateSavedForLaterTodo = (
  args: ActivateBody,
) => Promise<{ id: string }>;

export const activateSavedForLaterTodo: IActivateSavedForLaterTodo = async (
  activateBody,
) => {
  return wrappedFetch<{ id: string }>(
    `${getConfig().API_URL}/saved-for-later-todo/activate`,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activateBody),
    },
  );
};

export const ActivateMethodImpl = (
  appStore: AppStore,
  queryClient: QueryClient,
): ISavedForLaterTodoService['activate'] => {
  return ChimericMutationFactory(queryClient, {
    mutationFn: activateSavedForLaterTodo,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(data).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAllActiveTodos(appStore)().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneByIdActiveTodo(appStore)(data).queryKey,
      });
    },
  });
};
