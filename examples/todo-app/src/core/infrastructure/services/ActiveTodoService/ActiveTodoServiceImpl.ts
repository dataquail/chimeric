import { injectable, inject } from 'inversify';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
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

@injectable()
export class ActiveTodoServiceImpl implements IActiveTodoService {
  public getAll: IActiveTodoService['getAll'];
  public getOneById: IActiveTodoService['getOneById'];
  public clearAll: IActiveTodoService['clearAll'];
  public createOne: IActiveTodoService['createOne'];
  public deleteOne: IActiveTodoService['deleteOne'];
  public completeOne: IActiveTodoService['completeOne'];
  public uncompleteOne: IActiveTodoService['uncompleteOne'];
  public prioritize: IActiveTodoService['prioritize'];
  public deprioritize: IActiveTodoService['deprioritize'];

  constructor(
    @inject(InjectionSymbol('IAppStoreProvider'))
    appStoreProvider: InjectionType<'IAppStoreProvider'>,
    @inject(InjectionSymbol('IQueryClientProvider'))
    queryClientProvider: InjectionType<'IQueryClientProvider'>,
    @inject(InjectionSymbol('IApplicationEventEmitter'))
    applicationEventEmitter: InjectionType<'IApplicationEventEmitter'>,
  ) {
    this.getAll = GetAllMethodImpl(
      appStoreProvider.get(),
      queryClientProvider.get(),
    );
    this.getOneById = GetOneByIdMethodImpl(
      appStoreProvider.get(),
      queryClientProvider.get(),
    );
    this.clearAll = ClearAllMethodImpl(appStoreProvider.get());
    this.createOne = CreateOneMethodImpl(queryClientProvider.get());
    this.deleteOne = DeleteOneMethodImpl(
      queryClientProvider.get(),
      appStoreProvider.get(),
      applicationEventEmitter,
    );
    this.completeOne = CompleteOneMethodImpl(queryClientProvider.get());
    this.uncompleteOne = UncompleteOneMethodImpl(queryClientProvider.get());
    this.prioritize = PrioritizeMethodImpl(appStoreProvider.get());
    this.deprioritize = DeprioritizeMethodImpl(appStoreProvider.get());
  }
}
