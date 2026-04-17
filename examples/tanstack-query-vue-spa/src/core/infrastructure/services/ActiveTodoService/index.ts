import { GetAllMethodImpl } from './methods/getAll';
import { CreateOneMethodImpl } from './methods/createOne';
import { CompleteOneMethodImpl } from './methods/complete';
import { UncompleteOneMethodImpl } from './methods/uncomplete';
import { DeleteOneMethodImpl } from './methods/deleteOne';

export const activeTodoService = {
  getAll: GetAllMethodImpl,
  createOne: CreateOneMethodImpl,
  completeOne: CompleteOneMethodImpl,
  uncompleteOne: UncompleteOneMethodImpl,
  deleteOne: DeleteOneMethodImpl,
};
