import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const getSuspenseTestWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: React.ReactNode }) =>
    (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </QueryClientProvider>
    );
