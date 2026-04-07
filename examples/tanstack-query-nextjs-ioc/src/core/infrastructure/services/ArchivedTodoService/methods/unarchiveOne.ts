import { QueryClient } from '@tanstack/react-query';
import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { getInfiniteQueryOptionsGetAll } from './getAll';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { getQueryOptionsGetAll as getQueryOptionsGetAllActiveTodos } from '@/core/infrastructure/services/ActiveTodoService/methods/getAll';

export const UnarchiveOneMethodImpl = (
  queryClient: QueryClient,
): IArchivedTodoService['unarchiveOne'] => {
  return ChimericMutationFactory({
    queryClient,
    mutationFn: async (args: { id: string }) => {
      return wrappedFetch<{ id: string }>(
        `${getConfig().API_URL}/archived-todo/${args.id}/unarchive`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getInfiniteQueryOptionsGetAll().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAllActiveTodos().queryKey,
      });
    },
  });
};
