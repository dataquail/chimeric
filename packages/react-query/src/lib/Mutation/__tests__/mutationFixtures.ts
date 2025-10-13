import {
  IdiomaticMutationOptions,
  ReactiveMutationInvokeOptions,
  ReactiveMutationOptions,
} from '@chimeric/core';
import { DefineChimericMutation } from '../chimeric/types';
import { createIdiomaticMutation } from '../idiomatic/createIdiomaticMutation';
import {
  DefineIdiomaticMutation,
  TanstackIdiomaticNativeOptions,
} from '../idiomatic/types';
import { createReactiveMutation } from '../reactive/createReactiveMutation';
import {
  DefineReactiveMutation,
  TanstackMutationReactiveInvokeOptions,
  TanstackMutationReactiveNativeOptions,
  TanstackMutationReactiveReturnType,
} from '../reactive/types';

export const MutationTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (_allOptions?: {
          options?: IdiomaticMutationOptions;
          nativeOptions?: TanstackIdiomaticNativeOptions<void, string, Error>;
        }) => 'test',
      );
      return {
        fn,
        mutationFn: vi.fn(() => Promise.resolve('test')),
        idiomaticMutation: createIdiomaticMutation(fn),
        annotation: {} as DefineIdiomaticMutation<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const invokeFn = vi.fn(
        async (_allInvokeOptions?: {
          options?: ReactiveMutationInvokeOptions;
          nativeOptions?: TanstackMutationReactiveInvokeOptions<
            void,
            string,
            Error
          >;
        }) => 'test',
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: TanstackMutationReactiveNativeOptions<
            void,
            string,
            Error
          >;
        }) => ({
          invoke: invokeFn,
          isIdle: true,
          isPending: false,
          isSuccess: false,
          isError: false,
          error: null,
          data: 'test',
          reset: vi.fn(),
          native: undefined as unknown as TanstackMutationReactiveReturnType<
            void,
            string,
            Error
          >,
        }),
      );
      return {
        fn,
        invokeFn,
        mutationFn: vi.fn(() => Promise.resolve('test')),
        reactiveMutation: createReactiveMutation(fn),
        annotation: {} as DefineReactiveMutation<() => Promise<string>>,
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
        mutationFn: vi.fn(() => Promise.resolve('test')),
        annotation: {} as DefineChimericMutation<() => Promise<string>>,
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
            nativeOptions?: TanstackIdiomaticNativeOptions<
              { name: string },
              string,
              Error
            >;
          },
        ) => `Hello ${params.name}`,
      );
      return {
        fn,
        mutationFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        idiomaticMutation: createIdiomaticMutation(fn),
        annotation: {} as DefineIdiomaticMutation<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const invokeFn = vi.fn(
        async (
          params: { name: string },
          _allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TanstackMutationReactiveInvokeOptions<
              { name: string },
              string,
              Error
            >;
          },
        ) => {
          _params = params;
          return `Hello ${_params.name}`;
        },
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: TanstackMutationReactiveNativeOptions<
            { name: string },
            string,
            Error
          >;
        }) => ({
          invoke: invokeFn,
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: `Hello ${_params?.name}`,
          reset: vi.fn(),
          native: undefined as unknown as TanstackMutationReactiveReturnType<
            { name: string },
            string,
            Error
          >,
        }),
      );
      return {
        fn,
        invokeFn,
        mutationFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        reactiveMutation: createReactiveMutation(fn),
        annotation: {} as DefineReactiveMutation<
          (params: { name: string }) => Promise<string>
        >,
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
        mutationFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        annotation: {} as DefineChimericMutation<
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
            options?: IdiomaticMutationOptions;
            nativeOptions?: TanstackIdiomaticNativeOptions<
              { name: string } | undefined,
              string,
              Error
            >;
          },
        ) => (params ? `Hello ${params.name}` : 'Hello'),
      );
      return {
        fn,
        mutationFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        idiomaticMutation: createIdiomaticMutation(fn),
        annotation: {} as DefineIdiomaticMutation<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string } | undefined;
      const invokeFn = vi.fn(
        async (
          params?: { name: string },
          _allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TanstackMutationReactiveInvokeOptions<
              { name: string } | undefined,
              string,
              Error
            >;
          },
        ) => {
          _params = params;
          return _params ? `Hello ${_params.name}` : 'Hello';
        },
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: ReactiveMutationOptions;
          nativeOptions?: TanstackMutationReactiveInvokeOptions<
            { name: string } | undefined,
            string,
            Error
          >;
        }) => ({
          invoke: invokeFn,
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: _params ? `Hello ${_params.name}` : 'Hello',
          reset: vi.fn(),
          native: undefined as unknown as TanstackMutationReactiveReturnType<
            { name: string } | undefined,
            string,
            Error
          >,
        }),
      );
      return {
        fn,
        invokeFn,
        reactiveMutation: createReactiveMutation(fn),
        mutationFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        annotation: {} as DefineReactiveMutation<
          (params?: { name: string }) => Promise<string>
        >,
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
        mutationFn: vi.fn((args?: { name: string }) =>
          Promise.resolve(args ? `Hello ${args.name}` : 'Hello'),
        ),
        annotation: {} as DefineChimericMutation<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
