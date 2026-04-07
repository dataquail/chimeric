import { AppStore } from '@/lib/store';

export interface IAppStoreProvider {
  get(): AppStore;
}
