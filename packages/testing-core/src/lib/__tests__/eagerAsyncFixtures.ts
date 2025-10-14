import {
  createIdiomaticEagerAsync,
  createReactiveEagerAsync,
  IdiomaticEagerAsyncOptions,
  ReactiveEagerAsyncOptions,
} from '@chimeric/core';

export const EagerAsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async (_options?: IdiomaticEagerAsyncOptions) => 'test');
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
      };
    },
    getReactive: () => {
      const fn = vi.fn((_config?: ReactiveEagerAsyncOptions) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test' as string | undefined,
      }));
      return {
        fn,
        reactiveEagerAsync: createReactiveEagerAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticEagerAsync, fn: idiomaticFn } =
        EagerAsyncTestFixtures.withoutParams.getIdiomatic();
      const { reactiveEagerAsync, fn: reactiveFn } =
        EagerAsyncTestFixtures.withoutParams.getReactive();
      return {
        idiomaticEagerAsync,
        idiomaticFn,
        reactiveEagerAsync,
        reactiveFn,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params: { name: string },
          _options?: IdiomaticEagerAsyncOptions,
        ) => `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const fn = vi.fn(
        (params: { name: string }, _config?: ReactiveEagerAsyncOptions) => {
          _params = params;
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: `Hello ${_params.name}` as string | undefined,
          };
        },
      );
      return {
        fn,
        reactiveEagerAsync: createReactiveEagerAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticEagerAsync, fn: idiomaticFn } =
        EagerAsyncTestFixtures.withParams.getIdiomatic();
      const { reactiveEagerAsync, fn: reactiveFn } =
        EagerAsyncTestFixtures.withParams.getReactive();
      return {
        idiomaticEagerAsync,
        idiomaticFn,
        reactiveEagerAsync,
        reactiveFn,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params?: {
            name?: string;
          },
          _options?: IdiomaticEagerAsyncOptions,
        ) => (params?.name ? `Hello ${params.name}` : 'Hello'),
      );
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string } | undefined;
      const fn = vi.fn(
        (
          params?: { name: string },
          _config?: ReactiveEagerAsyncOptions,
        ) => {
          _params = params;
          return {
            isIdle: false,
            isPending: false,
            isSuccess: true,
            isError: false,
            error: null,
            data: (_params ? `Hello ${_params.name}` : 'Hello') as
              | string
              | undefined,
          };
        },
      );
      return {
        fn,
        reactiveEagerAsync: createReactiveEagerAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticEagerAsync, fn: idiomaticFn } =
        EagerAsyncTestFixtures.withOptionalParams.getIdiomatic();
      const { reactiveEagerAsync, fn: reactiveFn } =
        EagerAsyncTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticEagerAsync,
        idiomaticFn,
        reactiveEagerAsync,
        reactiveFn,
      };
    },
  },
};
