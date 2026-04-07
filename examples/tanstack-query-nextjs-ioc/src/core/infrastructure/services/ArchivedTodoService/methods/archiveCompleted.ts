import { QueryClient } from '@tanstack/react-query';
import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';
import { ChimericMutationFactory } from '@chimeric/react-query';
import { getInfiniteQueryOptionsGetAll } from './getAll';
import { getConfig } from '@/utils/getConfig';
import { wrappedFetch } from '@/utils/network/wrappedFetch';
import { ArchiveBody } from '@/core/domain/archivedTodo/dtos/in/ArchiveBody';
import { getQueryOptionsGetAll as getQueryOptionsGetAllActiveTodos } from '@/core/infrastructure/services/ActiveTodoService/methods/getAll';

export const ArchiveCompletedMethodImpl = (
  queryClient: QueryClient,
): IArchivedTodoService['archiveCompleted'] => {
  return ChimericMutationFactory({
    queryClient,
    mutationFn: async (body: ArchiveBody) => {
      return wrappedFetch<{ ids: string[] }>(
        `${getConfig().API_URL}/archived-todo/archive`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
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
