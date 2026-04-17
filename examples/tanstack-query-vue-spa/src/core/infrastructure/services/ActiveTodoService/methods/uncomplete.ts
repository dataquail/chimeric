import { ChimericMutationFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { getQueryOptionsGetAll } from './getAll';

export const UncompleteOneMethodImpl = ChimericMutationFactory<
  { id: string },
  void
>({
  queryClient,
  mutationFn: async (args: { id: string }) => {
    await wrappedFetch<{ message: string }>(
      `${getConfig().API_URL}/active-todo/${args.id}/uncomplete`,
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
      queryKey: getQueryOptionsGetAll().queryKey,
    });
  },
});
