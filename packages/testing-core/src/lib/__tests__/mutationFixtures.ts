import {
  createIdiomaticMutation,
  createReactiveMutation,
  IdiomaticMutationOptions,
  ReactiveMutationInvokeOptions,
  ReactiveMutationOptions,
} from '@chimeric/core';

export const MutationTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticMutationOptions;
          nativeOptions?: unknown;
        }) => 'test',
      );
      return {
        fn,
        idiomaticMutation: createIdiomaticMutation(fn),
      };
    },
    getReactive: () => {
      const invokeFn = vi.fn(
        async (_allInvokeOptions?: {
          options?: ReactiveMutationInvokeOptions;
          nativeOptions?: unknown;
        }) => 'test',
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: unknown;
        }) => ({
          invoke: invokeFn,
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: 'test',
          reset: vi.fn(),
          native: undefined as unknown,
        }),
      );
      return {
        fn,
        invokeFn,
        reactiveMutation: createReactiveMutation(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticMutation, fn: idiomaticFn } =
        MutationTestFixtures.withoutParams.getIdiomatic();
      const {
        reactiveMutation,
        fn: reactiveFn,
        invokeFn,
      } = MutationTestFixtures.withoutParams.getReactive();
      return {
        idiomaticMutation,
        idiomaticFn,
        reactiveMutation,
        reactiveFn,
        invokeFn,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params: { name: string },
          _allOptions?: {
            options?: IdiomaticMutationOptions;
            nativeOptions?: unknown;
          },
        ) => `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticMutation: createIdiomaticMutation(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const invokeFn = vi.fn(
        async (
          params: { name: string },
          _allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: unknown;
          },
        ) => {
          _params = params;
          return `Hello ${_params.name}`;
        },
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: unknown;
        }) => ({
          invoke: invokeFn,
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: `Hello ${_params?.name}`,
          reset: vi.fn(),
          native: undefined as unknown,
        }),
      );
      return {
        fn,
        invokeFn,
        reactiveMutation: createReactiveMutation(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticMutation, fn: idiomaticFn } =
        MutationTestFixtures.withParams.getIdiomatic();
      const {
        reactiveMutation,
        fn: reactiveFn,
        invokeFn,
      } = MutationTestFixtures.withParams.getReactive();
      return {
        idiomaticMutation,
        idiomaticFn,
        reactiveMutation,
        reactiveFn,
        invokeFn,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (
          params?: { name: string },
          _allOptions?: {
            options?: IdiomaticMutationOptions;
            nativeOptions?: unknown;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      return {
        fn,
        idiomaticMutation: createIdiomaticMutation(fn),
      };
    },
    getReactive: () => {
      let _params: { name: string } | undefined;
      const invokeFn = vi.fn(
        async (
          params?: { name: string },
          _allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: unknown;
          },
        ) => {
          _params = params;
          return _params ? `Hello ${_params.name}` : 'Hello';
        },
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: unknown;
        }) => ({
          invoke: invokeFn,
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: _params ? `Hello ${_params.name}` : 'Hello',
          reset: vi.fn(),
          native: undefined as unknown,
        }),
      );
      return {
        fn,
        invokeFn,
        reactiveMutation: createReactiveMutation(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticMutation, fn: idiomaticFn } =
        MutationTestFixtures.withOptionalParams.getIdiomatic();
      const {
        reactiveMutation,
        fn: reactiveFn,
        invokeFn,
      } = MutationTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticMutation,
        idiomaticFn,
        reactiveMutation,
        reactiveFn,
        invokeFn,
      };
    },
  },
};
