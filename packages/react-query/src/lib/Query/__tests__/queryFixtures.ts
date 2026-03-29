import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';
import { DefineChimericQuery } from '../chimeric/types';
import { createIdiomaticQuery } from '../idiomatic/createIdiomaticQuery';
import {
  DefineIdiomaticQuery,
  TanstackQueryIdiomaticNativeOptions,
} from '../idiomatic/types';
import { createReactiveQuery } from '../reactive/createReactiveQuery';
import {
  DefineReactiveQuery,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactivePrefetchNativeOptions,
  TanstackQueryReactiveReturnType,
} from '../reactive/types';

export const QueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<
            string,
            Error,
            string[]
          >;
        }) => 'test',
      );
      const prefetchFn = vi.fn(
        async (_allOptions?: {
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<
            string,
            Error,
            string[]
          >;
        }) => { return; },
      );
      return {
        fn,
        prefetchFn,
        queryFn: vi.fn(() => Promise.resolve('test')),
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<
          () => Promise<string>,
          Error,
          string[]
        >,
      };
    },
    getReactive: () => {
      const refetchFn = vi.fn(async () => 'test');
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: TanstackQueryReactiveNativeOptions<
            string,
            Error,
            string[]
          >;
        }) => ({
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: 'test' as string | undefined,
          refetch: refetchFn,
          native: undefined as unknown as TanstackQueryReactiveReturnType<
            string,
            Error
          >,
        }),
      );
      const usePrefetchHookFn = vi.fn(
        (_allOptions?: {
          nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
            string,
            Error,
            string[]
          >;
        }) => { return; },
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn(() => Promise.resolve('test')),
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<
          () => Promise<string>,
          Error,
          string[]
        >,
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
        queryFn: vi.fn(() => Promise.resolve('test')),
        annotation: {} as DefineChimericQuery<
          () => Promise<string>,
          Error,
          string[]
        >,
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
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => `Hello ${params.name}`,
      );
      const prefetchFn = vi.fn(
        async (
          _params: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => { return; },
      );
      return {
        fn,
        prefetchFn,
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        idiomaticQuery: createIdiomaticQuery<
          {
            name: string;
          },
          string,
          Error,
          string[]
        >(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<
          (params: { name: string }) => Promise<string>,
          Error,
          string[]
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
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              string,
              Error,
              string[]
            >;
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
            native: undefined as unknown as TanstackQueryReactiveReturnType<
              string,
              Error
            >,
          };
        },
      );
      const usePrefetchHookFn = vi.fn(
        (
          _params: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => { return; },
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<
          (params: { name: string }) => Promise<string>,
          Error,
          string[]
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
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        annotation: {} as DefineChimericQuery<
          (params: { name: string }) => Promise<string>,
          Error,
          string[]
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
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      const prefetchFn = vi.fn(
        async (
          _params?: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => { return; },
      );
      return {
        fn,
        prefetchFn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        idiomaticQuery: createIdiomaticQuery<
          { name: string },
          string,
          Error,
          string[]
        >(fn, prefetchFn),
        annotation: {} as DefineIdiomaticQuery<
          (params?: { name: string }) => Promise<string>,
          Error,
          string[]
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        (
          params?: { name: string },
          _allOptions?: {
            options?: ReactiveQueryOptions;
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              string,
              Error,
              string[]
            >;
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
            data: (capturedParams
              ? `Hello ${capturedParams.name}`
              : 'Hello') as string | undefined,
            refetch: refetchFn,
            native: undefined as unknown as TanstackQueryReactiveReturnType<
              string,
              Error
            >,
          };
        },
      );
      const usePrefetchHookFn = vi.fn(
        (
          _params?: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryReactivePrefetchNativeOptions<
              string,
              Error,
              string[]
            >;
          },
        ) => { return; },
      );
      // Create a shared mock refetch for testing call counts
      const sharedRefetchFn = vi.fn(async () => 'test');
      return {
        fn,
        refetchFn: sharedRefetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        reactiveQuery: createReactiveQuery(fn, usePrefetchHookFn),
        annotation: {} as DefineReactiveQuery<
          (params?: { name: string }) => Promise<string>,
          Error,
          string[]
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
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        annotation: {} as DefineChimericQuery<
          (params?: { name: string }) => Promise<string>,
          Error,
          string[]
        >,
      };
    },
  },
};
