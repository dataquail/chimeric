import { ITodoService } from 'src/core/domain/todo/ports/ITodoService';
import { GetAllMethodImpl } from './methods/getAll';
import { CreateOneMethodImpl } from './methods/createOne';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { ToggleOneMethodImpl } from './methods/toggleOne';

export const todoService: ITodoService = {
  getAll: GetAllMethodImpl,
  createOne: CreateOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
  toggleOne: ToggleOneMethodImpl,
};
