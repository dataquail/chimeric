import { ReactiveInfiniteQueryTestHarness } from '../ReactiveInfiniteQueryTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';

describe('ReactiveInfiniteQueryTestHarness', () => {
  // USAGE
  it('USAGE: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    const query = ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
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
    expect(query.result.current.data).toBeDefined();
  });

  it('USAGE: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    const query = ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      wrapper: getTestWrapper(queryClient),
      params: { filter: 'test' },
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
    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('Filtered test Item 1');
  });

  it('USAGE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    const query = ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
      wrapper: getTestWrapper(queryClient),
      params: { filter: 'test' },
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
    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('Filtered test Item 1');
  });

  it('USAGE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    const query = ReactiveInfiniteQueryTestHarness({
      reactiveInfiniteQuery,
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
    const data = query.result.current.data as
      | {
          pages: Array<{
            data: string[];
            nextCursor?: string;
            prevCursor?: string;
          }>;
          pageParams: string[];
        }
      | undefined;
    expect(data?.pages[0]?.data[0]).toBe('All Items 1');
  });

  // TYPE ERRORS
  it('TYPE ERRORS: no params', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error - should error because params are not expected
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        wrapper: getTestWrapper(queryClient),
        params: { filter: 'test' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error - should error because params are expected
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        wrapper: getTestWrapper(queryClient),
      });

      ReactiveInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        reactiveInfiniteQuery,
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: with optional params', async () => {
    const queryClient = new QueryClient();
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error - should error because wrong params
      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ReactiveInfiniteQueryTestHarness({
        reactiveInfiniteQuery,
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });
});
