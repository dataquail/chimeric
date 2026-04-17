import { GetAllMethodImpl } from './methods/getAll';
import { ArchiveCompletedMethodImpl } from './methods/archiveCompleted';
import { UnarchiveOneMethodImpl } from './methods/unarchiveOne';
import { DeleteOneMethodImpl } from './methods/deleteOne';

export const archivedTodoService = {
  getAll: GetAllMethodImpl,
  archiveCompleted: ArchiveCompletedMethodImpl,
  unarchiveOne: UnarchiveOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
};
