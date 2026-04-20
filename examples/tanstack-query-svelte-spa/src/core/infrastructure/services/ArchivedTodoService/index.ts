import { ArchiveCompletedMethodImpl } from './methods/archiveCompleted';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { GetAllMethodImpl } from './methods/getAll';
import { UnarchiveOneMethodImpl } from './methods/unarchiveOne';
import { IArchivedTodoService } from 'src/core/domain/archivedTodo/ports/IArchivedTodoService';

export const archivedTodoService: IArchivedTodoService = {
  getAll: GetAllMethodImpl,
  archiveCompleted: ArchiveCompletedMethodImpl,
  unarchiveOne: UnarchiveOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
};
