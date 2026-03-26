import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { injectComponent } from '@/utils/inversify/InjectComponent/DI';
import { InjectionSymbol, type InjectionType } from '@/core/global/types';

type InjectedProps = {
  appStoreProvider: InjectionType<'IAppStoreProvider'>;
};

type OwnProps = {
  children: ReactNode;
};

export const ReduxTestWrapper = injectComponent<InjectedProps, OwnProps>(
  { appStoreProvider: InjectionSymbol('IAppStoreProvider') },
  ({ appStoreProvider, children }) => {
    return <Provider store={appStoreProvider.get()}>{children}</Provider>;
  },
);
