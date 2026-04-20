import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { GET_ALL_ARCHIVED_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';
import { GET_ALL_QUERY_KEY } from '../../ActiveTodoService/methods/getAll';

export const UnarchiveOneMethodImpl: IArchivedTodoService['unarchiveOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async ({ id }: { id: string }) =>
      wrappedFetch<{ id: string }>(
        `${getConfig().API_URL}/archived-todo/${id}/unarchive`,
        { method: 'post' },
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: GET_ALL_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: GET_ALL_ARCHIVED_QUERY_KEY }),
      ]);
    },
  });
