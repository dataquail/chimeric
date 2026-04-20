import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { GET_ALL_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const CompleteOneMethodImpl: IActiveTodoService['completeOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async ({ id }: { id: string }) =>
      wrappedFetch<void>(
        `${getConfig().API_URL}/active-todo/${id}/complete`,
        { method: 'post' },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: GET_ALL_QUERY_KEY,
      });
    },
  });
