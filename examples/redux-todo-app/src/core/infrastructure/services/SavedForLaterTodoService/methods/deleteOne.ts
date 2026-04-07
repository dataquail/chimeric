import { ChimericMutationFactory } from '@chimeric/rtk-query';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const DeleteOneMethodImpl: ISavedForLaterTodoService['deleteOne'] =
  ChimericMutationFactory({
    store: appStore,
    endpoint: todoApi.endpoints.deleteSavedForLaterTodo,
  });
