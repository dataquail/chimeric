import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { container } from 'src/core/global/container';

type Props = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: Props) => {
  return <Provider store={container.appStoreProvider.get()}>{children}</Provider>;
};
