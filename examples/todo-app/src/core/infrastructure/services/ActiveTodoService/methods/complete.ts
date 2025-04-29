import { QueryClient } from '@tanstack/react-query';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { getQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetOneById } from './getOneById';
import { AppStore } from 'src/lib/store';

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
  appStore: AppStore,
  queryClient: QueryClient,
): IActiveTodoService['completeOne'] => {
  return ChimericMutationFactory(queryClient, {
    mutationFn: async (args: { id: string }) => {
      await completeActiveTodo(args);
    },
    onSuccess: async (_data, args) => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll(appStore)().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(appStore)(args).queryKey,
      });
    },
  });
};
