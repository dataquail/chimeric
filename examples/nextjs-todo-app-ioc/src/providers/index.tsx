'use client';

import 'reflect-metadata';
import '@/core/global/inversify.config';

import { ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';
import { QueryClientProvider } from './QueryClientProvider';
import { StoreProvider } from './StoreProvider';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </ThemeProvider>
    </StoreProvider>
  );
};
