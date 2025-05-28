import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { appStore } from 'src/core/global/appStore';

type OwnProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: OwnProps) => {
  return <Provider store={appStore}>{children}</Provider>;
};
