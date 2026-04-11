import { CompleteOneMethodImpl } from './methods/completeOne';
import { CreateOneMethodImpl } from './methods/createOne';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { GetAllMethodImpl } from './methods/getAll';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { UncompleteOneMethodImpl } from './methods/uncompleteOne';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const activeTodoService: IActiveTodoService = {
  getAll: GetAllMethodImpl,
  createOne: CreateOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
  completeOne: CompleteOneMethodImpl,
  uncompleteOne: UncompleteOneMethodImpl,
  getOneById: GetOneByIdMethodImpl,
};
