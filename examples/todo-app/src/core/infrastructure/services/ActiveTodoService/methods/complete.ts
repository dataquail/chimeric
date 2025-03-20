import { QueryClient } from '@tanstack/react-query';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { makeChimericMutation } from 'src/utils/domain/makeChimericMutation';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { getQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetOneById } from './getOneById';

export type ICompleteActiveTodo = (args: {
  id: string;
}) => Promise<{ message: string }>;

export const completeActiveTodo: ICompleteActiveTodo = async (args: {
  id: string;
}) => {
  return wrappedFetch<{ message: string }>(
    `${getConfig().API_URL}/active-todo/${args.id}/complete`,
    {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
};

export const CompleteOneMethodImpl = (
  queryClient: QueryClient,
): IActiveTodoService['completeOne'] => {
  return makeChimericMutation({
    mutationFn: async (args: { id: string }) => {
      await completeActiveTodo(args);
    },
    errorHelpers: {},
    onSuccess: async (_data, args) => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(args).queryKey,
      });
    },
  });
};
