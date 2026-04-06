import { IQueryClientProvider } from 'src/core/global/queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from 'src/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { CompleteOneMethodImpl } from './methods/complete';
import { UncompleteOneMethodImpl } from './methods/uncomplete';
import { GetAllMethodImpl } from './methods/getAll';
import { CreateOneMethodImpl } from './methods/createOne';
import { ClearAllMethodImpl } from './methods/clearAll';

export const createActiveTodoService = (
  queryClientProvider: IQueryClientProvider,
  applicationEventEmitter: IApplicationEventEmitter,
): IActiveTodoService => ({
  getAll: GetAllMethodImpl(queryClientProvider.get(), applicationEventEmitter),
  getOneById: GetOneByIdMethodImpl(queryClientProvider.get()),
  clearAll: ClearAllMethodImpl(queryClientProvider.get()),
  createOne: CreateOneMethodImpl(queryClientProvider.get()),
  deleteOne: DeleteOneMethodImpl(
    queryClientProvider.get(),
    applicationEventEmitter,
  ),
  completeOne: CompleteOneMethodImpl(queryClientProvider.get()),
  uncompleteOne: UncompleteOneMethodImpl(queryClientProvider.get()),
});
