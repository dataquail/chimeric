import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const getTestWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
