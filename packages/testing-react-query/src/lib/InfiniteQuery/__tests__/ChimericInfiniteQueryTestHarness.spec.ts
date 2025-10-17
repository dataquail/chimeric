import { fuseChimericInfiniteQuery } from '@chimeric/react-query';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericInfiniteQueryTestHarness } from '@chimeric/testing-core';
import { InfiniteQueryTestFixtures } from '../../__tests__/infiniteQueryFixtures';

describe('ChimericInfiniteQueryTestHarness', () => {
  // USAGE: IDIOMATIC
  it('USAGE: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
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
    expect(query.result.current.data).toBeDefined();
  });

  it('USAGE: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
      params: { filter: 'test' },
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

  it('USAGE: IDIOMATIC: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
      params: { filter: 'test' },
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

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

  it('USAGE: IDIOMATIC: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

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

  // USAGE: REACTIVE
  it('USAGE: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
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
    expect(query.result.current.data).toBeDefined();
  });

  it('USAGE: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
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

  it('USAGE: REACTIVE: with optional params - with params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
      params: { filter: 'test' },
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

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

  it('USAGE: REACTIVE: with optional params - without params provided', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    const query = ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery: fuseChimericInfiniteQuery({
        idiomatic: idiomaticInfiniteQuery,
        reactive: reactiveInfiniteQuery,
      }),
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

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

  // TYPE ERRORS: IDIOMATIC
  it('TYPE ERRORS: IDIOMATIC: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric(queryClient);

    try {
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        // @ts-expect-error - should error because params are not expected
        params: { filter: 'test' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: IDIOMATIC: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'idiomatic',
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });

  // TYPE ERRORS: REACTIVE
  it('TYPE ERRORS: REACTIVE: no params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric(queryClient);

    try {
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        // @ts-expect-error - should error because params are not expected
        params: { filter: 'test' },
      });
    } catch {
      // Expected error
    }
  });

  it('TYPE ERRORS: REACTIVE: with params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because params are expected
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
      });

      ChimericInfiniteQueryTestHarness({
        // @ts-expect-error - should error because wrong params
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });
    } catch {
      // Expected errors
    }
  });

  it('TYPE ERRORS: REACTIVE: with optional params', async () => {
    const queryClient = new QueryClient();
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric(queryClient);

    try {
      // @ts-expect-error - should error because wrong params
      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
        params: { wrong: 'param' },
      });

      ChimericInfiniteQueryTestHarness({
        chimericInfiniteQuery: fuseChimericInfiniteQuery({
          idiomatic: idiomaticInfiniteQuery,
          reactive: reactiveInfiniteQuery,
        }),
        method: 'reactive',
        wrapper: getTestWrapper(queryClient),
      });
    } catch {
      // Expected error
    }
  });
});
