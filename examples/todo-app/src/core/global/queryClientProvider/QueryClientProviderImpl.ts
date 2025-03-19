import { injectable } from 'inversify';
import { IQueryClientProvider } from './IQueryClientProvider';
import { QueryClient } from '@tanstack/react-query';

@injectable()
export class QueryClientProviderImpl implements IQueryClientProvider {
  private readonly _queryClient: QueryClient;

  constructor() {
    this._queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
      },
    });
  }

  public get() {
    return this._queryClient;
  }
}
