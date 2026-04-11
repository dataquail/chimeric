import { ChimericMutationFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { fakeApi } from 'src/utils/fakeApi';
import { getQueryOptionsGetAll } from './getAll';
import { ITodoService } from 'src/core/domain/todo/ports/ITodoService';

export const ToggleOneMethodImpl: ITodoService['toggleOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: ({ id }) => fakeApi.toggleTodo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
    },
  });
