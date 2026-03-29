import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { container } from 'src/core/global/container';

type Props = {
  children: ReactNode;
};

export const ReduxTestWrapper = ({ children }: Props) => {
  return <Provider store={container.appStoreProvider.get()}>{children}</Provider>;
};
