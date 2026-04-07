import { GetAllMethodImpl } from './methods/getAll';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { SaveForLaterMethodImpl } from './methods/saveForLater';
import { ActivateMethodImpl } from './methods/activate';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

export const savedForLaterTodoService: ISavedForLaterTodoService = {
  getAll: GetAllMethodImpl,
  getOneById: GetOneByIdMethodImpl,
  saveForLater: SaveForLaterMethodImpl,
  activate: ActivateMethodImpl,
  deleteOne: DeleteOneMethodImpl,
};
