import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { IQueryClientProvider } from 'src/core/global/queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from 'src/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { IAppStoreProvider } from 'src/core/global/appStoreProvider/IAppStoreProvider';
import { GetAllMethodImpl } from './methods/getAll';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { SaveForLaterMethodImpl } from './methods/saveForLater';
import { ActivateMethodImpl } from './methods/activate';
import { DeleteOneMethodImpl } from './methods/deleteOne';

export const createSavedForLaterTodoService = (
  queryClientProvider: IQueryClientProvider,
  applicationEventEmitter: IApplicationEventEmitter,
  appStoreProvider: IAppStoreProvider,
): ISavedForLaterTodoService => ({
  getAll: GetAllMethodImpl(queryClientProvider.get()),
  getOneById: GetOneByIdMethodImpl(queryClientProvider.get()),
  saveForLater: SaveForLaterMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  activate: ActivateMethodImpl(
    appStoreProvider.get(),
    queryClientProvider.get(),
  ),
  deleteOne: DeleteOneMethodImpl(
    queryClientProvider.get(),
    applicationEventEmitter,
  ),
});
