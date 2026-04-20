import { ChimericMutationFactory } from '@chimeric/svelte-query';
import { getConfig } from 'src/utils/getConfig';
import { wrappedFetch } from 'src/utils/network/wrappedFetch';
import { CreateTodoBody } from 'src/core/domain/activeTodo/dtos/in/CreateTodoBody';
import { GET_ALL_QUERY_KEY } from './getAll';
import { queryClient } from 'src/core/global/queryClient';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const CreateOneMethodImpl: IActiveTodoService['createOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: async (body: CreateTodoBody) =>
      wrappedFetch<{ id: string }>(`${getConfig().API_URL}/active-todo`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: GET_ALL_QUERY_KEY });
    },
  });
