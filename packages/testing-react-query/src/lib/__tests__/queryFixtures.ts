import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';
import {
  IdiomaticQueryFactory,
  ReactiveQueryFactory,
} from '@chimeric/react-query';
import { QueryClient, queryOptions } from '@tanstack/react-query';

export const QueryTestFixtures = {
  withoutParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: unknown;
        }) => 'test',
      );
      return {
        fn,
        idiomaticQuery: IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: () =>
            queryOptions({
              queryKey: ['test'],
              queryFn: () => fn(),
            }),
        }),
      };
    },
    getReactive: () => {
      const queryFn = vi.fn(async () => 'test');
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
      return {
        fn,
        queryFn,
        refetchFn,
        reactiveQuery: ReactiveQueryFactory({
          getQueryOptions: () =>
            queryOptions({
              queryKey: ['test'],
              queryFn,
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withoutParams.getIdiomatic(queryClient);
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
      };
    },
  },
  withParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (
          params: { name: string },
          _allOptions?: {
            options?: IdiomaticQueryOptions;
            nativeOptions?: unknown;
          },
        ) => `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticQuery: IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: (args: { name: string }) =>
            queryOptions({
              queryKey: ['test', args.name],
              queryFn: () => fn(args),
            }),
        }),
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const queryFn = vi.fn(async (args: { name: string }) => `Hello ${args.name}`);
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
      return {
        fn,
        queryFn,
        refetchFn,
        reactiveQuery: ReactiveQueryFactory({
          getQueryOptions: (args: { name: string }) =>
            queryOptions({
              queryKey: ['test', args.name],
              queryFn: () => queryFn(args),
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withParams.getIdiomatic(queryClient);
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
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: (queryClient: QueryClient) => {
      const fn = vi.fn(
        async (
          params?: { name: string },
          _allOptions?: {
            options?: IdiomaticQueryOptions;
            nativeOptions?: unknown;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      return {
        fn,
        idiomaticQuery: IdiomaticQueryFactory({
          queryClient,
          getQueryOptions: (args?: { name: string }) =>
            queryOptions({
              queryKey: args?.name ? ['test', args.name] : ['test'],
              queryFn: () => fn(args),
            }),
        }),
      };
    },
    getReactive: () => {
      const queryFn = vi.fn(async (args?: { name: string }) =>
        args ? `Hello ${args.name}` : 'Hello',
      );
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
            data: (capturedParams
              ? `Hello ${capturedParams.name}`
              : 'Hello') as string | undefined,
            refetch: refetchFn,
            native: undefined as unknown,
          };
        },
      );
      // Create a shared mock refetch for testing call counts
      const sharedRefetchFn = vi.fn(async () => 'test');
      return {
        fn,
        queryFn,
        refetchFn: sharedRefetchFn,
        reactiveQuery: ReactiveQueryFactory({
          getQueryOptions: (args?: { name: string }) =>
            queryOptions({
              queryKey: args?.name ? ['test', args.name] : ['test'],
              queryFn: () => queryFn(args),
            }),
        }),
      };
    },
    getChimeric: (queryClient: QueryClient) => {
      const { idiomaticQuery, fn: idiomaticFn } =
        QueryTestFixtures.withOptionalParams.getIdiomatic(queryClient);
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
      };
    },
  },
};
