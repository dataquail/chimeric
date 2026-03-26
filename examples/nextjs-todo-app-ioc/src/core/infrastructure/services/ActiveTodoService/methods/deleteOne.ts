import { AppStore } from '@/lib/store';
import { QueryClient } from '@tanstack/react-query';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { IActiveTodoService } from '@/core/domain/activeTodo/ports/IActiveTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { removeActiveTodo } from '../activeTodoStore';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { getQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetOneById } from './getOneById';
import { ActiveTodoDeletedEvent } from '@/core/domain/activeTodo/events/ActiveTodoDeletedEvent';

export type IDeleteActiveTodo = (args: {
  id: string;
}) => Promise<{ message: string }>;

export const deleteActiveTodo: IDeleteActiveTodo = async (args: {
  id: string;
}) => {
  return wrappedFetch<{ message: string }>(
    `${getConfig().API_URL}/active-todo/${args.id}`,
    {
      method: 'delete',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
};

export const DeleteOneMethodImpl = (
  queryClient: QueryClient,
  appStore: AppStore,
  applicationEventEmitter: IApplicationEventEmitter,
): IActiveTodoService['deleteOne'] => {
  return ChimericMutationFactory({
    queryClient,
    mutationFn: async (args: { id: string }) => {
      await deleteActiveTodo(args);
    },
    onSuccess: async (_data, args) => {
      applicationEventEmitter.emit(new ActiveTodoDeletedEvent({ id: args.id }));
      appStore.dispatch(removeActiveTodo(args.id));
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll(appStore)().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetOneById(appStore)(args).queryKey,
      });
    },
  });
};
