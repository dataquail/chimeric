import { DefineChimericQuery } from '../chimeric/types';
import { createIdiomaticQuery } from '@chimeric/core';
import { IdiomaticQueryOptions } from '@chimeric/core';
import {
  DefineIdiomaticQuery,
  TanstackQueryIdiomaticNativeOptions,
} from '../idiomatic/types';
import {
  DefineReactiveQuery,
  VueQueryReactiveNativeOptions,
  VueQueryReactivePrefetchNativeOptions,
  VueQueryReactiveReturnType,
} from '../reactive/types';
import { markReactive, TYPE_MARKERS } from '@chimeric/core';

export const QueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
        }) => 'test',
      );
      const prefetchFn = vi.fn(
        async (_allOptions?: {
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
        }) => {
          return;
        },
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
          options?: { enabled?: boolean };
          nativeOptions?: VueQueryReactiveNativeOptions<string, Error>;
        }) => ({
          isIdle: { value: true } as { value: boolean },
          isPending: { value: false } as { value: boolean },
          isSuccess: { value: false } as { value: boolean },
          isError: { value: false } as { value: boolean },
          error: { value: null } as { value: null },
          data: { value: 'test' as string | undefined },
          refetch: refetchFn,
          native: undefined as unknown as VueQueryReactiveReturnType<
            string,
            Error
          >,
        }),
      );
      const usePrefetchHookFn = vi.fn(
        (_allOptions?: {
          nativeOptions?: VueQueryReactivePrefetchNativeOptions<string, Error>;
        }) => {
          return;
        },
      );
      const reactiveQuery = markReactive(
        { useHook: fn, usePrefetchHook: usePrefetchHookFn },
        TYPE_MARKERS.REACTIVE_QUERY,
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn(() => Promise.resolve('test')),
        reactiveQuery,
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
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
          },
        ) => `Hello ${params.name}`,
      );
      const prefetchFn = vi.fn(
        async (
          _params: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
          },
        ) => {
          return;
        },
      );
      return {
        fn,
        prefetchFn,
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
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
            options?: { enabled?: boolean };
            nativeOptions?: VueQueryReactiveNativeOptions<string, Error>;
          },
        ) => {
          _params = params;
          return {
            isIdle: { value: false } as { value: boolean },
            isPending: { value: false } as { value: boolean },
            isSuccess: { value: true } as { value: boolean },
            isError: { value: false } as { value: boolean },
            error: { value: null } as { value: null },
            data: { value: `Hello ${_params.name}` as string | undefined },
            refetch: refetchFn,
            native: undefined as unknown as VueQueryReactiveReturnType<
              string,
              Error
            >,
          };
        },
      );
      const usePrefetchHookFn = vi.fn();
      const reactiveQuery = markReactive(
        { useHook: fn, usePrefetchHook: usePrefetchHookFn },
        TYPE_MARKERS.REACTIVE_QUERY,
      );
      return {
        fn,
        refetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        reactiveQuery,
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
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      const prefetchFn = vi.fn(
        async (
          _params?: { name: string },
          _allOptions?: {
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<string, Error>;
          },
        ) => {
          return;
        },
      );
      return {
        fn,
        prefetchFn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        idiomaticQuery: createIdiomaticQuery(fn, prefetchFn),
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
            options?: { enabled?: boolean };
            nativeOptions?: VueQueryReactiveNativeOptions<string, Error>;
          },
        ) => {
          const capturedParams = params;
          const refetchFn = vi.fn(async () =>
            capturedParams ? `Hello ${capturedParams.name}` : 'Hello',
          );
          return {
            isIdle: { value: false } as { value: boolean },
            isPending: { value: false } as { value: boolean },
            isSuccess: { value: true } as { value: boolean },
            isError: { value: false } as { value: boolean },
            error: { value: null } as { value: null },
            data: {
              value: (capturedParams
                ? `Hello ${capturedParams.name}`
                : 'Hello') as string | undefined,
            },
            refetch: refetchFn,
            native: undefined as unknown as VueQueryReactiveReturnType<
              string,
              Error
            >,
          };
        },
      );
      const usePrefetchHookFn = vi.fn();
      const sharedRefetchFn = vi.fn(async () => 'test');
      const reactiveQuery = markReactive(
        { useHook: fn, usePrefetchHook: usePrefetchHookFn },
        TYPE_MARKERS.REACTIVE_QUERY,
      );
      return {
        fn,
        refetchFn: sharedRefetchFn,
        usePrefetchHookFn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        reactiveQuery,
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
