import {
  createIdiomaticQuery,
  createReactiveQuery,
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
} from '@chimeric/core';

export const QueryTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: unknown;
        }) => 'test',
      );
      return {
        fn,
        idiomaticQuery: createIdiomaticQuery(fn),
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
      return {
        fn,
        refetchFn,
        reactiveQuery: createReactiveQuery(fn),
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
      return {
        fn,
        idiomaticQuery: createIdiomaticQuery(fn),
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
      return {
        fn,
        refetchFn,
        reactiveQuery: createReactiveQuery(fn),
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
      return {
        fn,
        idiomaticQuery: createIdiomaticQuery(fn),
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
        refetchFn: sharedRefetchFn,
        reactiveQuery: createReactiveQuery(fn),
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
      };
    },
  },
};
