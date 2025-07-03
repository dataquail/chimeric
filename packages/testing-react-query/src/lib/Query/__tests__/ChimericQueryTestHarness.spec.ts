import {
  ReactiveQueryFactory,
  IdiomaticQueryFactory,
  fuseChimericQuery,
} from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericQueryTestHarness } from '@chimeric/testing-core';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ChimericQueryTestHarness', () => {
  it('idiomatic no params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const mockReactiveQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockIdiomaticQueryFn,
      }),
    );
    const reactiveQuery = ReactiveQueryFactory(() =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockReactiveQueryFn,
      }),
    );

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(1);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(0);
  });

  it('idiomatic with params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = makeAsyncFnWithParamsReturnsString();
    const mockReactiveQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory(
      queryClient,
      (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => mockIdiomaticQueryFn(args),
        }),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { name: string }) =>
      queryOptions({
        queryKey: ['test', args.name],
        queryFn: () => mockReactiveQueryFn(args),
      }),
    );

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(1);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(0);
  });

  it('reactive no params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const mockReactiveQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory(queryClient, () =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockIdiomaticQueryFn,
      }),
    );
    const reactiveQuery = ReactiveQueryFactory(() =>
      queryOptions({
        queryKey: ['test'],
        queryFn: mockReactiveQueryFn,
      }),
    );

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(0);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(1);
  });

  it('reactive with params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = makeAsyncFnWithParamsReturnsString();
    const mockReactiveQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = IdiomaticQueryFactory(
      queryClient,
      (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => mockIdiomaticQueryFn(args),
        }),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { name: string }) =>
      queryOptions({
        queryKey: ['test', args.name],
        queryFn: () => mockReactiveQueryFn(args),
      }),
    );

    const query = ChimericQueryTestHarness({
      chimericQuery: fuseChimericQuery({
        idiomatic: idiomaticQuery,
        reactive: reactiveQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(true);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(0);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(1);
  });
});
