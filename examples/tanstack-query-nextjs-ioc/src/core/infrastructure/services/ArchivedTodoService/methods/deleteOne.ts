import { QueryClient } from '@tanstack/react-query';
import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { getInfiniteQueryOptionsGetAll } from './getAll';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { ArchivedTodoDeletedEvent } from '@/core/domain/archivedTodo/events/ArchivedTodoDeletedEvent';

export const DeleteOneMethodImpl = (
  queryClient: QueryClient,
  applicationEventEmitter: IApplicationEventEmitter,
): IArchivedTodoService['deleteOne'] => {
  return ChimericMutationFactory({
    queryClient,
    mutationFn: async (args: { id: string }) => {
      await wrappedFetch<{ message: string }>(
        `${getConfig().API_URL}/archived-todo/${args.id}`,
        {
          method: 'delete',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    },
    onSuccess: async (_data, args) => {
      applicationEventEmitter.emit(
        new ArchivedTodoDeletedEvent({ id: args.id }),
      );
      await queryClient.invalidateQueries({
        queryKey: getInfiniteQueryOptionsGetAll().queryKey,
      });
    },
  });
};
