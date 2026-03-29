import { IAppStoreProvider } from 'src/core/global/appStoreProvider/IAppStoreProvider';
import { IQueryClientProvider } from 'src/core/global/queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from 'src/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { IActiveTodoService } from 'src/core/domain/activeTodo/ports/IActiveTodoService';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { CompleteOneMethodImpl } from './methods/complete';
import { UncompleteOneMethodImpl } from './methods/uncomplete';
import { GetAllMethodImpl } from './methods/getAll';
import { CreateOneMethodImpl } from './methods/createOne';
import { PrioritizeMethodImpl } from './methods/prioritize';
import { DeprioritizeMethodImpl } from './methods/deprioritize';
import { ClearAllMethodImpl } from './methods/clearAll';

export const createActiveTodoService = (
  appStoreProvider: IAppStoreProvider,
  queryClientProvider: IQueryClientProvider,
  applicationEventEmitter: IApplicationEventEmitter,
): IActiveTodoService => ({
  getAll: GetAllMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  getOneById: GetOneByIdMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  clearAll: ClearAllMethodImpl(appStoreProvider.get()),
  createOne: CreateOneMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  deleteOne: DeleteOneMethodImpl(
    queryClientProvider.get(),
    appStoreProvider.get(),
    applicationEventEmitter,
  ),
  completeOne: CompleteOneMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  uncompleteOne: UncompleteOneMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  prioritize: PrioritizeMethodImpl(appStoreProvider.get()),
  deprioritize: DeprioritizeMethodImpl(appStoreProvider.get()),
});
