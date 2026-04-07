import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const getThemeWrapper = () => {
  return {
    ThemeWrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    ),
  };
};
