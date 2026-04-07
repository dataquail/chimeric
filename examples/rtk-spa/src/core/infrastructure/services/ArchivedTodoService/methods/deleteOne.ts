import { ChimericMutationFactory } from '@chimeric/rtk-query';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const DeleteOneMethodImpl: IArchivedTodoService['deleteOne'] =
  ChimericMutationFactory({
    store: appStore,
    endpoint: todoApi.endpoints.deleteArchivedTodo,
  });
