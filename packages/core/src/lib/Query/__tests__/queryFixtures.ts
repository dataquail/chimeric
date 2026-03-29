import { DefineChimericQuery } from '../chimeric/types';
import { createIdiomaticQuery } from '../idiomatic/createIdiomaticQuery';
import {
  DefineIdiomaticQuery,
  IdiomaticQueryOptions,
} from '../idiomatic/types';
import { createReactiveQuery } from '../reactive/createReactiveQuery';
import {
  DefineReactiveQuery,
  ReactiveQueryOptions,
} from '../reactive/types';

export const QueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: unknown;
        }) => 'test',
      );
      const prefetchFn = vi.fn(
        async (_allOptions?: {
          nativeOptions?: unknown;
        }) => { return; },
      );
      return {
        fn,
        prefetchFn,
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const refetchFn = vi.fn(async () => 'test');
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: unknown;
        }) => ({
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: 'test' as string | undefined,
          refetch: refetchFn,
          native: undefined as unknown,
        }),
      );
      const usePrefetchHookFn = vi.fn(
        (_allOptions?: {
          nativeOptions?: unknown;
        }) => { return; },
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<() => Promise<string>>,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn, prefetchFn } =
        QueryTestFixtures.withoutParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
        usePrefetchHookFn,
      } = QueryTestFixtures.withoutParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        prefetchFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
        usePrefetchHookFn,
        annotation: {} as DefineChimericQuery<() => Promise<string>>,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params: { name: string },
          _allOptions?: {
            options?: IdiomaticQueryOptions;
            nativeOptions?: unknown;
          },
        ) => `Hello ${params.name}`,
      );
      const prefetchFn = vi.fn(
        async (
          _params: { name: string },
          _allOptions?: {
            nativeOptions?: unknown;
          },
        ) => { return; },
      );
      return {
        fn,
        prefetchFn,
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const refetchFn = vi.fn(async () => `Hello ${_params.name}`);
      const fn = vi.fn(
        (
          params: { name: string },
          _allOptions?: {
            options?: ReactiveQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          _params = params;
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: `Hello ${_params.name}` as string | undefined,
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      const usePrefetchHookFn = vi.fn(
        (
          _params: { name: string },
          _allOptions?: {
            nativeOptions?: unknown;
          },
        ) => { return; },
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn, prefetchFn } =
        QueryTestFixtures.withParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
        usePrefetchHookFn,
      } = QueryTestFixtures.withParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        prefetchFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
        usePrefetchHookFn,
        annotation: {} as DefineChimericQuery<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params?: { name: string },
          _allOptions?: {
            options?: IdiomaticQueryOptions;
            nativeOptions?: unknown;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      const prefetchFn = vi.fn(
        async (
          _params?: { name: string },
          _allOptions?: {
            nativeOptions?: unknown;
          },
        ) => { return; },
      );
      return {
        fn,
        prefetchFn,
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        (
          params?: { name: string },
          _allOptions?: {
            options?: ReactiveQueryOptions;
            nativeOptions?: unknown;
          },
        ) => {
          // Capture params for this specific call
          const capturedParams = params;
          const refetchFn = vi.fn(async () =>
            capturedParams ? `Hello ${capturedParams.name}` : 'Hello',
          );
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: (capturedParams ? `Hello ${capturedParams.name}` : 'Hello') as
              | string
              | undefined,
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      const usePrefetchHookFn = vi.fn(
        (
          _params?: { name: string },
          _allOptions?: {
            nativeOptions?: unknown;
          },
        ) => { return; },
      );
      // Create a shared mock refetch for testing call counts
      const sharedRefetchFn = vi.fn(async () => 'test');
      return {
        fn,
        refetchFn: sharedRefetchFn,
        usePrefetchHookFn,
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn, prefetchFn } =
        QueryTestFixtures.withOptionalParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
        usePrefetchHookFn,
      } = QueryTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        prefetchFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
        usePrefetchHookFn,
        annotation: {} as DefineChimericQuery<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
