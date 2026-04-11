import { ChimericMutationFactory } from '@chimeric/vue-query';
import { queryClient } from 'src/core/global/queryClient';
import { fakeApi } from 'src/utils/fakeApi';
import { getQueryOptionsGetAll } from './getAll';
import { ITodoService } from 'src/core/domain/todo/ports/ITodoService';

export const DeleteOneMethodImpl: ITodoService['deleteOne'] =
  ChimericMutationFactory({
    queryClient,
    mutationFn: ({ id }) => fakeApi.deleteTodo(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryOptionsGetAll().queryKey,
      });
    },
  });
