'use client';

import { ReactNode } from 'react';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { getContainer } from '@/core/global/container';

type Props = {
  children: ReactNode;
};

export const QueryClientProvider = ({ children }: Props) => {
  return (
    <ReactQueryClientProvider client={getContainer().queryClientProvider.get()}>
      {children}
    </ReactQueryClientProvider>
  );
};
