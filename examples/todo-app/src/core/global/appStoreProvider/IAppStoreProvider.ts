import { AppStore } from 'src/lib/store';

export interface IAppStoreProvider {
  get(): AppStore;
}
