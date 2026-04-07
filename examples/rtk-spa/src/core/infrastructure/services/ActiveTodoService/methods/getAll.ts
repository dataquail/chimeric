import { ChimericQueryFactory } from '@chimeric/rtk-query';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const GetAllMethodImpl: IActiveTodoService['getAll'] =
  ChimericQueryFactory({
    store: appStore,
    endpoint: todoApi.endpoints.getAllActiveTodos,
    endpointName: 'getAllActiveTodos',
    api: todoApi,
  });
