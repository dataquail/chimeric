import { ChimericMutationFactory } from '@chimeric/rtk-query';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { todoApi } from 'src/core/global/todoApi';
import { appStore } from 'src/core/global/appStore';

export const DeleteOneMethodImpl: IActiveTodoService['deleteOne'] =
  ChimericMutationFactory({
    store: appStore,
    endpoint: todoApi.endpoints.deleteActiveTodo,
  });
