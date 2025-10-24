import {
  createIdiomaticSync,
  createReactiveSync,
  fuseChimericSync,
} from '@chimeric/core';
import {
  IdiomaticEagerAsyncFactory,
  ReactiveEagerAsyncFactory,
  ChimericEagerAsyncFactory,
} from '@chimeric/react';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../../Query/idiomatic/IdiomaticQueryFactory';
import { ReactiveQueryFactory } from '../../Query/reactive/ReactiveQueryFactory';
import { ChimericQueryFactory } from '../../Query/chimeric/ChimericQueryFactory';

/**
 * Comprehensive test fixtures for AsyncReducer testing.
 *
 * This fixture provides test objects for sync, eagerAsync, and query interfaces,
 * each with three parameter variants: withParams, withoutParams, and withOptionalParams.
 *
 * Each service type includes getIdiomatic(), getReactive(), and getChimeric() methods
 * that return mocked implementations with type annotations for testing.
 */

export const AsyncReducerTestFixtures = {
  // ==================== SYNC SERVICES ====================
  sync: {
    withoutParams: {
      getIdiomatic: () => {
        const fn = vi.fn(() => 'sync-no-params');
        return {
          fn,
          idiomaticSync: createIdiomaticSync(fn),
          annotation: createIdiomaticSync(fn),
        };
      },
      getReactive: () => {
        const fn = vi.fn(() => 'sync-no-params');
        const reactiveSync = createReactiveSync(fn);
        return {
          fn,
          reactiveSync,
          annotation: reactiveSync,
        };
      },
      getChimeric: () => {
        const { idiomaticSync, fn: idiomaticFn } =
          AsyncReducerTestFixtures.sync.withoutParams.getIdiomatic();
        const { reactiveSync, fn: reactiveFn } =
          AsyncReducerTestFixtures.sync.withoutParams.getReactive();
        const chimericSync = fuseChimericSync({
          idiomatic: idiomaticSync,
          reactive: reactiveSync,
        });
        return {
          chimericSync,
          idiomaticFn,
          reactiveFn,
          annotation: chimericSync,
        };
      },
    },
    withParams: {
      getIdiomatic: () => {
        const fn = vi.fn((params: { value: string }, _options?: any) => `sync-${params?.value ?? 'undefined'}`);
        return {
          fn,
          idiomaticSync: createIdiomaticSync(fn),
          annotation: createIdiomaticSync(fn),
        };
      },
      getReactive: () => {
        const fn = vi.fn((params: { value: string }, _options?: any) => `sync-${params?.value ?? 'undefined'}`);
        const reactiveSync = createReactiveSync(fn);
        return {
          fn,
          reactiveSync,
          annotation: reactiveSync,
        };
      },
      getChimeric: () => {
        const { idiomaticSync, fn: idiomaticFn } =
          AsyncReducerTestFixtures.sync.withParams.getIdiomatic();
        const { reactiveSync, fn: reactiveFn } =
          AsyncReducerTestFixtures.sync.withParams.getReactive();
        const chimericSync = fuseChimericSync({
          idiomatic: idiomaticSync,
          reactive: reactiveSync,
        });
        return {
          chimericSync,
          idiomaticFn,
          reactiveFn,
          annotation: chimericSync,
        };
      },
    },
    withOptionalParams: {
      getIdiomatic: () => {
        const fn = vi.fn((params?: { value: string }) =>
          params ? `sync-${params.value}` : 'sync-default',
        );
        return {
          fn,
          idiomaticSync: createIdiomaticSync(fn),
          annotation: createIdiomaticSync(fn),
        };
      },
      getReactive: () => {
        const fn = vi.fn((params?: { value: string }) =>
          params ? `sync-${params.value}` : 'sync-default',
        );
        const reactiveSync = createReactiveSync(fn);
        return {
          fn,
          reactiveSync,
          annotation: reactiveSync,
        };
      },
      getChimeric: () => {
        const { idiomaticSync, fn: idiomaticFn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getIdiomatic();
        const { reactiveSync, fn: reactiveFn } =
          AsyncReducerTestFixtures.sync.withOptionalParams.getReactive();
        const chimericSync = fuseChimericSync({
          idiomatic: idiomaticSync,
          reactive: reactiveSync,
        });
        return {
          chimericSync,
          idiomaticFn,
          reactiveFn,
          annotation: chimericSync,
        };
      },
    },
  },

  // ==================== EAGER ASYNC SERVICES ====================
  eagerAsync: {
    withoutParams: {
      getIdiomatic: () => {
        const fn = vi.fn(async () => 'eager-no-params');
        return {
          fn,
          idiomaticEagerAsync: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
          annotation: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
        };
      },
      getReactive: () => {
        const fn = vi.fn(async () => 'eager-no-params');
        const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          fn,
          reactiveEagerAsync,
          annotation: reactiveEagerAsync,
        };
      },
      getChimeric: () => {
        const fn = vi.fn(async () => 'eager-no-params');
        const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          chimericEagerAsync,
          idiomaticFn: fn,
          reactiveFn: fn,
          annotation: chimericEagerAsync,
        };
      },
    },
    withParams: {
      getIdiomatic: () => {
        const fn = vi.fn(
          async (params: { value: string }) => `eager-${params.value}`,
        );
        return {
          fn,
          idiomaticEagerAsync: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
          annotation: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
        };
      },
      getReactive: () => {
        const fn = vi.fn(
          async (params: { value: string }) => `eager-${params.value}`,
        );
        const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          fn,
          reactiveEagerAsync,
          annotation: reactiveEagerAsync,
        };
      },
      getChimeric: () => {
        const fn = vi.fn(
          async (params: { value: string }) => `eager-${params.value}`,
        );
        const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          chimericEagerAsync,
          idiomaticFn: fn,
          reactiveFn: fn,
          annotation: chimericEagerAsync,
        };
      },
    },
    withOptionalParams: {
      getIdiomatic: () => {
        const fn = vi.fn(async (params?: { value: string }) =>
          params ? `eager-${params.value}` : 'eager-default',
        );
        return {
          fn,
          idiomaticEagerAsync: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
          annotation: IdiomaticEagerAsyncFactory({ eagerAsyncFn: fn }),
        };
      },
      getReactive: () => {
        const fn = vi.fn(async (params?: { value: string }) =>
          params ? `eager-${params.value}` : 'eager-default',
        );
        const reactiveEagerAsync = ReactiveEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          fn,
          reactiveEagerAsync,
          annotation: reactiveEagerAsync,
        };
      },
      getChimeric: () => {
        const fn = vi.fn(async (params?: { value: string }) =>
          params ? `eager-${params.value}` : 'eager-default',
        );
        const chimericEagerAsync = ChimericEagerAsyncFactory({ eagerAsyncFn: fn });
        return {
          chimericEagerAsync,
          idiomaticFn: fn,
          reactiveFn: fn,
          annotation: chimericEagerAsync,
        };
      },
    },
  },

  // ==================== QUERY SERVICES ====================
  query: {
    withoutParams: {
      getIdiomatic: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn(() => Promise.resolve('query-no-params'));
        const idiomaticQuery = IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: () =>
            queryOptions({
              queryKey: ['test-no-params'],
              queryFn,
            }),
        });
        return {
          queryClient,
          queryFn,
          idiomaticQuery,
          annotation: idiomaticQuery,
        };
      },
      getReactive: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn(() => Promise.resolve('query-no-params'));
        const reactiveQuery = ReactiveQueryFactory({
          getQueryOptions: () =>
            queryOptions({
              queryKey: ['test-no-params'],
              queryFn,
            }),
        });
        return {
          queryClient,
          queryFn,
          reactiveQuery,
          annotation: reactiveQuery,
        };
      },
      getChimeric: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn(() => Promise.resolve('query-no-params'));
        const chimericQuery = ChimericQueryFactory({
          queryClient,
          getQueryOptions: () =>
            queryOptions({
              queryKey: ['test-no-params'],
              queryFn,
            }),
        });
        return {
          queryClient,
          queryFn,
          chimericQuery,
          annotation: chimericQuery,
        };
      },
    },
    withParams: {
      getIdiomatic: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args: { value: string }) =>
          Promise.resolve(`query-${args.value}`),
        );
        const idiomaticQuery = IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: (params: { value: string }) =>
            queryOptions({
              queryKey: ['test-params', params.value],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          idiomaticQuery,
          annotation: idiomaticQuery,
        };
      },
      getReactive: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args: { value: string }) =>
          Promise.resolve(`query-${args.value}`),
        );
        const reactiveQuery = ReactiveQueryFactory({
          getQueryOptions: (params: { value: string }) =>
            queryOptions({
              queryKey: ['test-params', params.value],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          reactiveQuery,
          annotation: reactiveQuery,
        };
      },
      getChimeric: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args: { value: string }) =>
          Promise.resolve(`query-${args.value}`),
        );
        const chimericQuery = ChimericQueryFactory({
          queryClient,
          getQueryOptions: (params: { value: string }) =>
            queryOptions({
              queryKey: ['test-params', params.value],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          chimericQuery,
          annotation: chimericQuery,
        };
      },
    },
    withOptionalParams: {
      getIdiomatic: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args?: { value: string }) =>
          Promise.resolve(args ? `query-${args.value}` : 'query-default'),
        );
        const idiomaticQuery = IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: (params?: { value: string }) =>
            queryOptions({
              queryKey: params?.value
                ? ['test-optional', params.value]
                : ['test-optional'],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          idiomaticQuery,
          annotation: idiomaticQuery,
        };
      },
      getReactive: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args?: { value: string }) =>
          Promise.resolve(args ? `query-${args.value}` : 'query-default'),
        );
        const reactiveQuery = ReactiveQueryFactory({
          getQueryOptions: (params?: { value: string }) =>
            queryOptions({
              queryKey: params?.value
                ? ['test-optional', params.value]
                : ['test-optional'],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          reactiveQuery,
          annotation: reactiveQuery,
        };
      },
      getChimeric: () => {
        const queryClient = new QueryClient();
        const queryFn = vi.fn((args?: { value: string }) =>
          Promise.resolve(args ? `query-${args.value}` : 'query-default'),
        );
        const chimericQuery = ChimericQueryFactory({
          queryClient,
          getQueryOptions: (params?: { value: string }) =>
            queryOptions({
              queryKey: params?.value
                ? ['test-optional', params.value]
                : ['test-optional'],
              queryFn: () => queryFn(params),
            }),
        });
        return {
          queryClient,
          queryFn,
          chimericQuery,
          annotation: chimericQuery,
        };
      },
    },
  },
};
