import { ISavedForLaterTodoService } from '@/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { IQueryClientProvider } from '@/core/global/queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from '@/core/global/ApplicationEventEmitter/IApplicationEventEmitter';
import { GetAllMethodImpl } from './methods/getAll';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { SaveForLaterMethodImpl } from './methods/saveForLater';
import { ActivateMethodImpl } from './methods/activate';
import { DeleteOneMethodImpl } from './methods/deleteOne';

export const createSavedForLaterTodoService = (
  queryClientProvider: IQueryClientProvider,
  applicationEventEmitter: IApplicationEventEmitter,
): ISavedForLaterTodoService => ({
  getAll: GetAllMethodImpl(queryClientProvider.get()),
  getOneById: GetOneByIdMethodImpl(queryClientProvider.get()),
  saveForLater: SaveForLaterMethodImpl(queryClientProvider.get()),
  activate: ActivateMethodImpl(queryClientProvider.get()),
  deleteOne: DeleteOneMethodImpl(
    queryClientProvider.get(),
    applicationEventEmitter,
  ),
});
