import { IArchivedTodoService } from '@/core/domain/archivedTodo/ports/IArchivedTodoService';
import { IQueryClientProvider } from '@/core/global/queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { GetAllMethodImpl } from './methods/getAll';
import { ArchiveCompletedMethodImpl } from './methods/archiveCompleted';
import { UnarchiveOneMethodImpl } from './methods/unarchiveOne';
import { DeleteOneMethodImpl } from './methods/deleteOne';

export const createArchivedTodoService = (
  queryClientProvider: IQueryClientProvider,
  applicationEventEmitter: IApplicationEventEmitter,
): IArchivedTodoService => ({
  getAll: GetAllMethodImpl(queryClientProvider.get()),
  archiveCompleted: ArchiveCompletedMethodImpl(queryClientProvider.get()),
  unarchiveOne: UnarchiveOneMethodImpl(queryClientProvider.get()),
  deleteOne: DeleteOneMethodImpl(
    queryClientProvider.get(),
    applicationEventEmitter,
  ),
});
