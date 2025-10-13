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
      return {
        fn,
        queryFn: vi.fn(() => Promise.resolve('test')),
        idiomaticQuery: createIdiomaticQuery(fn),
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
      return {
        fn,
        refetchFn,
        queryFn: vi.fn(() => Promise.resolve('test')),
        reactiveQuery: createReactiveQuery(fn),
        annotation: {} as DefineReactiveQuery<
          () => Promise<string>,
          Error,
          string[]
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withoutParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
      } = QueryTestFixtures.withoutParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
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
      return {
        fn,
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
        >(fn),
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
      return {
        fn,
        refetchFn,
        queryFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        reactiveQuery: createReactiveQuery(fn),
        annotation: {} as DefineReactiveQuery<
          (params: { name: string }) => Promise<string>,
          Error,
          string[]
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
      } = QueryTestFixtures.withParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
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
      return {
        fn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        idiomaticQuery: createIdiomaticQuery<
          { name: string },
          string,
          Error,
          string[]
        >(fn),
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
      // Create a shared mock refetch for testing call counts
      const sharedRefetchFn = vi.fn(async () => 'test');
      return {
        fn,
        refetchFn: sharedRefetchFn,
        queryFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        reactiveQuery: createReactiveQuery(fn),
        annotation: {} as DefineReactiveQuery<
          (params?: { name: string }) => Promise<string>,
          Error,
          string[]
        >,
      };
    },
    getChimeric: () => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withOptionalParams.getIdiomatic();
      const {
        reactiveQuery,
        fn: reactiveFn,
        refetchFn,
      } = QueryTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticQuery,
        idiomaticFn,
        reactiveQuery,
        reactiveFn,
        refetchFn,
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
