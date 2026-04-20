import { QueryClient } from '@tanstack/svelte-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: false,
    },
  },
});
