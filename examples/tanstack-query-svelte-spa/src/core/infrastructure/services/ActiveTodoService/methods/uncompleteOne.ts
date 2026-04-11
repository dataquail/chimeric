import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { GET_ALL_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const UncompleteOneMethodImpl: IActiveTodoService['uncompleteOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async ({ id }: { id: string }) =>
      wrappedFetch<{ id: string }>(
        `${getConfig().API_URL}/active-todo/${id}/uncomplete`,
        { method: 'post' },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GET_ALL_QUERY_KEY,
      });
    },
  });
