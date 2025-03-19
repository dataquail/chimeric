import { injectable } from 'inversify';
import { IAppStoreProvider } from './IAppStoreProvider';
import { AppStore, makeStore } from 'src/lib/store';

@injectable()
export class AppStoreProviderImpl implements IAppStoreProvider {
  private readonly _store: AppStore;

  constructor() {
    this._store = makeStore();
  }

  public get() {
    return this._store;
  }
}
