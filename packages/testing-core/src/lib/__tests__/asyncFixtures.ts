import {
  createIdiomaticAsync,
  createReactiveAsync,
  IdiomaticAsyncOptions,
  ReactiveAsyncInvokeOptions,
} from '@chimeric/core';

export const AsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async (_options?: IdiomaticAsyncOptions) => 'test');
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
      };
    },
    getReactive: () => {
      const invokeFn = vi.fn(
        async (_options?: ReactiveAsyncInvokeOptions) => 'test',
      );
      const fn = vi.fn(() => ({
        invoke: invokeFn,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
      }));
      return {
        fn,
        invokeFn,
        reactiveAsync: createReactiveAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticAsync, fn: idiomaticFn } =
        AsyncTestFixtures.withoutParams.getIdiomatic();
      const {
        reactiveAsync,
        fn: reactiveFn,
        invokeFn,
      } = AsyncTestFixtures.withoutParams.getReactive();
      return {
        idiomaticAsync,
        idiomaticFn,
        reactiveAsync,
        reactiveFn,
        invokeFn,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (params: { name: string }, _options?: IdiomaticAsyncOptions) =>
          `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const invokeFn = vi.fn(
        async (
          params: { name: string },
          _options?: ReactiveAsyncInvokeOptions,
        ) => {
          _params = params;
          return `Hello ${_params.name}`;
        },
      );
      const fn = vi.fn(() => ({
        invoke: invokeFn,
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: `Hello ${_params?.name}`,
      }));
      return {
        fn,
        invokeFn,
        reactiveAsync: createReactiveAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticAsync, fn: idiomaticFn } =
        AsyncTestFixtures.withParams.getIdiomatic();
      const {
        reactiveAsync,
        fn: reactiveFn,
        invokeFn,
      } = AsyncTestFixtures.withParams.getReactive();
      return {
        idiomaticAsync,
        idiomaticFn,
        reactiveAsync,
        reactiveFn,
        invokeFn,
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
          _options?: IdiomaticAsyncOptions,
        ) => (params?.name ? `Hello ${params.name}` : 'Hello'),
      );
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string } | undefined;
      const invokeFn = vi.fn(
        async (
          params?: { name: string },
          _options?: ReactiveAsyncInvokeOptions,
        ) => {
          _params = params;
          return _params ? `Hello ${_params.name}` : 'Hello';
        },
      );
      const fn = vi.fn(() => ({
        invoke: invokeFn,
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: _params ? `Hello ${_params.name}` : 'Hello',
      }));
      return {
        fn,
        invokeFn,
        reactiveAsync: createReactiveAsync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticAsync, fn: idiomaticFn } =
        AsyncTestFixtures.withOptionalParams.getIdiomatic();
      const {
        reactiveAsync,
        fn: reactiveFn,
        invokeFn,
      } = AsyncTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticAsync,
        idiomaticFn,
        reactiveAsync,
        reactiveFn,
        invokeFn,
      };
    },
  },
};
