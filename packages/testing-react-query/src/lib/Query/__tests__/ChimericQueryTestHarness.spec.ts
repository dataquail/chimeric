import {
  ReactiveQueryFactory,
  IdiomaticQueryFactory,
  fuseChimericQuery,
} from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericQueryTestHarness } from '@chimeric/testing-core';

describe('ChimericQueryTestHarness', () => {
  it('idiomatic no params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = vi.fn(() => Promise.resolve('test'));
    const mockReactiveQueryFn = vi.fn(() => Promise.resolve('test'));
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
    const mockIdiomaticQueryFn = vi.fn((args: { id: string }) =>
      Promise.resolve(args.id),
    );
    const mockReactiveQueryFn = vi.fn((args: { id: string }) =>
      Promise.resolve(args.id),
    );
    const idiomaticQuery = IdiomaticQueryFactory(
      queryClient,
      (args: { id: string }) =>
        queryOptions({
          queryKey: ['test', args.id],
          queryFn: () => mockIdiomaticQueryFn(args),
        }),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { id: string }) =>
      queryOptions({
        queryKey: ['test', args.id],
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
      params: { id: '1' },
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
    expect(query.result.current.data).toBe('1');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(1);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(0);
  });

  it('reactive no params', async () => {
    const queryClient = new QueryClient();
    const mockIdiomaticQueryFn = vi.fn(() => Promise.resolve('test'));
    const mockReactiveQueryFn = vi.fn(() => Promise.resolve('test'));
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
    const mockIdiomaticQueryFn = vi.fn((args: { id: string }) =>
      Promise.resolve(args.id),
    );
    const mockReactiveQueryFn = vi.fn((args: { id: string }) =>
      Promise.resolve(args.id),
    );
    const idiomaticQuery = IdiomaticQueryFactory(
      queryClient,
      (args: { id: string }) =>
        queryOptions({
          queryKey: ['test', args.id],
          queryFn: () => mockIdiomaticQueryFn(args),
        }),
    );
    const reactiveQuery = ReactiveQueryFactory((args: { id: string }) =>
      queryOptions({
        queryKey: ['test', args.id],
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
      params: { id: '1' },
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
    expect(query.result.current.data).toBe('1');
    expect(mockIdiomaticQueryFn).toHaveBeenCalledTimes(0);
    expect(mockReactiveQueryFn).toHaveBeenCalledTimes(1);
  });
});
