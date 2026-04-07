import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { theme } from '../theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      {children}
    </MantineProvider>
  );
};
