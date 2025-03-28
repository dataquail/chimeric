import { QueryClient } from '@tanstack/react-query';

export interface IQueryClientProvider {
  get(): QueryClient;
}
