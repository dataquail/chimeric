import { ChimericInfiniteQueryFactory } from '@chimeric/rtk-query';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const GetAllMethodImpl: IArchivedTodoService['getAll'] =
  ChimericInfiniteQueryFactory({
    store: appStore,
    endpoint: todoApi.endpoints.getAllArchivedTodos,
    endpointName: 'getAllArchivedTodos',
    api: todoApi,
  });
