import { ChimericQueryFactory } from '@chimeric/rtk-query';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const GetOneByIdMethodImpl: ISavedForLaterTodoService['getOneById'] =
  ChimericQueryFactory({
    store: appStore,
    endpoint: todoApi.endpoints.getSavedForLaterTodoById,
    endpointName: 'getSavedForLaterTodoById',
    api: todoApi,
  });
