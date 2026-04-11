import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { GET_ALL_ARCHIVED_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';

export const DeleteOneMethodImpl: IArchivedTodoService['deleteOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async ({ id }: { id: string }) =>
      wrappedFetch<void>(
        `${getConfig().API_URL}/archived-todo/${id}`,
        { method: 'delete' },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GET_ALL_ARCHIVED_QUERY_KEY,
      });
    },
  });
