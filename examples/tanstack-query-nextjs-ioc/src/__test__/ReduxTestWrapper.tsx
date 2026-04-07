import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { getContainer } from '@/core/global/container';

type Props = {
  children: ReactNode;
};

export const ReduxTestWrapper = ({ children }: Props) => {
  return (
    <Provider store={getContainer().appStoreProvider.get()}>
      {children}
    </Provider>
  );
};
