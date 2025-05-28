import { GetOneByIdMethodImpl } from './methods/getOneById';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { CompleteOneMethodImpl } from './methods/complete';
import { UncompleteOneMethodImpl } from './methods/uncomplete';
import { GetAllMethodImpl } from './methods/getAll';
import { CreateOneMethodImpl } from './methods/createOne';
import { PrioritizeMethodImpl } from './methods/prioritize';
import { DeprioritizeMethodImpl } from './methods/deprioritize';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';

export const activeTodoService: IActiveTodoService = {
  getAll: GetAllMethodImpl,
  createOne: CreateOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
  completeOne: CompleteOneMethodImpl,
  uncompleteOne: UncompleteOneMethodImpl,
  prioritize: PrioritizeMethodImpl,
  deprioritize: DeprioritizeMethodImpl,
  getOneById: GetOneByIdMethodImpl,
};
