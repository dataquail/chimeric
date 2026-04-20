import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { ArchiveBody } from 'src/core/domain/archivedTodo/dtos/in/ArchiveBody';
import { GET_ALL_ARCHIVED_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';
import { GET_ALL_QUERY_KEY } from '../../ActiveTodoService/methods/getAll';

export const ArchiveCompletedMethodImpl: IArchivedTodoService['archiveCompleted'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async (body: ArchiveBody) =>
      wrappedFetch<{ ids: string[] }>(
        `${getConfig().API_URL}/archived-todo/archive`,
        {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: GET_ALL_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: GET_ALL_ARCHIVED_QUERY_KEY }),
      ]);
    },
  });
