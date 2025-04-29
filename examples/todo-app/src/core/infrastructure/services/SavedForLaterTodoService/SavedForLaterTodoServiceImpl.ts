import { ISavedForLaterTodoService } from 'src/core/domain/savedForLaterTodo/ports/ISavedForLaterTodoService';
import { GetAllMethodImpl } from './methods/getAll';
import { GetOneByIdMethodImpl } from './methods/getOneById';
import { SaveForLaterMethodImpl } from './methods/saveForLater';
import { ActivateMethodImpl } from './methods/activate';
import { DeleteOneMethodImpl } from './methods/deleteOne';
import { inject, injectable } from 'inversify';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

@injectable()
export class SavedForLaterTodoServiceImpl implements ISavedForLaterTodoService {
  public getAll: ISavedForLaterTodoService['getAll'];
  public getOneById: ISavedForLaterTodoService['getOneById'];
  public saveForLater: ISavedForLaterTodoService['saveForLater'];
  public activate: ISavedForLaterTodoService['activate'];
  public deleteOne: ISavedForLaterTodoService['deleteOne'];

  constructor(
    @inject(InjectionSymbol('IQueryClientProvider'))
    queryClientProvider: InjectionType<'IQueryClientProvider'>,
    @inject(InjectionSymbol('IApplicationEventEmitter'))
    applicationEventEmitter: InjectionType<'IApplicationEventEmitter'>,
    @inject(InjectionSymbol('IAppStoreProvider'))
    appStoreProvider: InjectionType<'IAppStoreProvider'>,
  ) {
    this.getAll = GetAllMethodImpl(queryClientProvider.get());
    this.getOneById = GetOneByIdMethodImpl(queryClientProvider.get());
    this.saveForLater = SaveForLaterMethodImpl(
      appStoreProvider.get(),
      queryClientProvider.get(),
    );
    this.activate = ActivateMethodImpl(
      appStoreProvider.get(),
      queryClientProvider.get(),
    );
    this.deleteOne = DeleteOneMethodImpl(
      queryClientProvider.get(),
      applicationEventEmitter,
    );
  }
}
