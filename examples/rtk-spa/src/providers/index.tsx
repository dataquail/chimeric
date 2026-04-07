import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { StoreProvider } from './StoreProvider';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  );
};
