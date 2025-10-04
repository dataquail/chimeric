import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import {
  makeAsyncFnWithOptionalParamsReturnsString,
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticQueryWithOptionalParamsReturnsString,
  IdiomaticQueryWithoutParamsReturnsString,
  IdiomaticQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';

describe('IdiomaticQueryFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: mockQueryFn,
        }),
    });
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: async () => mockQueryFn(args),
        }),
    });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should refetch when forceRefetch is true', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    });
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test'],
          queryFn: () => mockQueryFn({ name: args.name }),
        }),
    });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });

    const result2 = await idiomaticQuery({ name: 'Paul' });

    expect(result2).toBe('Hello John');

    const result3 = await idiomaticQuery(
      { name: 'Ringo' },
      { options: { forceRefetch: true } },
    );

    expect(result3).toBe('Hello Ringo');
    expect(mockQueryFn).toHaveBeenCalledTimes(2);
  });

  it('should handle type annotations without params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithoutParamsReturnsString =
      IdiomaticQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({ queryKey: ['test'], queryFn: mockQueryFn }),
      });
    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithParamsReturnsString =
      IdiomaticQueryFactory({
        queryClient,
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => mockQueryFn(args),
          }),
      });
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle optional params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory({
      queryClient,
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: ['test', args?.name],
          queryFn: () => mockQueryFn(args),
        }),
    });
    const resultWithParams = await idiomaticQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await idiomaticQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledWith(undefined);
  });

  it('should handle type annotations with optional params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithOptionalParamsReturnsString =
      IdiomaticQueryFactory({
        queryClient,
        getQueryOptions: (params?: { name: string }) =>
          queryOptions({
            queryKey: params?.name ? ['test', params?.name] : ['test'],
            queryFn: () => mockQueryFn(params),
          }),
      });
    const resultWithParams = await idiomaticQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await idiomaticQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledWith(undefined);
  });
});
