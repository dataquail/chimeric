import { ChimericMutationFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { CreateTodoBody } from 'src/core/domain/activeTodo/dtos/in/CreateTodoBody';
import { getQueryOptionsGetAll } from './getAll';

export const CreateOneMethodImpl = ChimericMutationFactory<
  CreateTodoBody,
  { id: string }
>({
  queryClient,
  mutationFn: async (body: CreateTodoBody) => {
    return wrappedFetch<{ id: string }>(`${getConfig().API_URL}/active-todo`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: getQueryOptionsGetAll().queryKey,
    });
  },
});
