import { ChimericQueryFactory } from '@chimeric/rtk-query';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const GetAllMethodImpl: ISavedForLaterTodoService['getAll'] =
  ChimericQueryFactory({
    store: appStore,
    endpoint: todoApi.endpoints.getAllSavedForLaterTodos,
    endpointName: 'getAllSavedForLaterTodos',
    api: todoApi,
  });
