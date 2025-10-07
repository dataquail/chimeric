import { ReactiveQueryFactory } from '@chimeric/react-query';
import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import {
  makeAsyncFnWithOptionalParamsReturnsString,
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ReactiveQueryTestHarness', () => {
  it('should be a function', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: () =>
        queryOptions({
          queryKey: ['test'],
          queryFn: mockQueryFn,
        }),
    });

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
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
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });

  it('should wait for success with params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args: { name: string }) =>
        queryOptions({
          queryKey: ['test', args.name],
          queryFn: () => mockQueryFn(args),
        }),
    });

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
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
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });

  it('should wait for success with optional params', async () => {
    const queryClient = new QueryClient();
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const reactiveQuery = ReactiveQueryFactory({
      getQueryOptions: (args?: { name: string }) =>
        queryOptions({
          queryKey: args?.name ? ['test', args.name] : ['test'],
          queryFn: () => mockQueryFn(args),
        }),
    });

    const query = ReactiveQueryTestHarness({
      reactiveQuery,
      wrapper: getTestWrapper(queryClient),
      // params: { name: 'John' }, // No params provided
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
    expect(query.result.current.data).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledTimes(1);
  });
});
