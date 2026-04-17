import { ChimericMutationFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { ArchiveBody } from 'src/core/domain/archivedTodo/dtos/in/ArchiveBody';
import { getInfiniteQueryOptionsGetAll } from './getAll';
import { getQueryOptionsGetAll as getQueryOptionsGetAllActiveTodos } from 'src/core/infrastructure/services/ActiveTodoService/methods/getAll';

export const ArchiveCompletedMethodImpl = ChimericMutationFactory<
  ArchiveBody,
  { ids: string[] }
>({
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
