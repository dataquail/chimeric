import { DefineChimericMutation } from '../chimeric/types';
import { createIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutationOptions } from '@chimeric/core';
import {
  DefineIdiomaticMutation,
  TanstackIdiomaticNativeOptions,
} from '../idiomatic/types';
import {
  DefineReactiveMutation,
  VueMutationReactiveInvokeOptions,
  VueMutationReactiveNativeOptions,
  VueMutationReactiveReturnType,
} from '../reactive/types';
import { markReactive, TYPE_MARKERS } from '@chimeric/core';

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
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveInvokeOptions<void, string, Error>;
        }) => 'test',
      );
      const fn = vi.fn(
        (_allOptions?: {
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveNativeOptions<void, string, Error>;
        }) => ({
          invoke: invokeFn,
          isIdle: { value: true } as { value: boolean },
          isPending: { value: false } as { value: boolean },
          isSuccess: { value: false } as { value: boolean },
          isError: { value: false } as { value: boolean },
          error: { value: null } as { value: null },
          data: { value: 'test' as string | undefined },
          reset: vi.fn(),
          native: undefined as unknown as VueMutationReactiveReturnType<
            void,
            string,
            Error
          >,
        }),
      );
      const reactiveMutation = markReactive(
        { useHook: fn },
        TYPE_MARKERS.REACTIVE_MUTATION,
      );
      return {
        fn,
        invokeFn,
        mutationFn: vi.fn(() => Promise.resolve('test')),
        reactiveMutation,
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
            options?: Record<string | number | symbol, never>;
            nativeOptions?: VueMutationReactiveInvokeOptions<
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
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveNativeOptions<
            { name: string },
            string,
            Error
          >;
        }) => ({
          invoke: invokeFn,
          isIdle: { value: false } as { value: boolean },
          isPending: { value: false } as { value: boolean },
          isSuccess: { value: true } as { value: boolean },
          isError: { value: false } as { value: boolean },
          error: { value: null } as { value: null },
          data: { value: `Hello ${_params?.name}` as string | undefined },
          reset: vi.fn(),
          native: undefined as unknown as VueMutationReactiveReturnType<
            { name: string },
            string,
            Error
          >,
        }),
      );
      const reactiveMutation = markReactive(
        { useHook: fn },
        TYPE_MARKERS.REACTIVE_MUTATION,
      );
      return {
        fn,
        invokeFn,
        mutationFn: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        reactiveMutation,
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
            options?: Record<string | number | symbol, never>;
            nativeOptions?: VueMutationReactiveInvokeOptions<
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
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveInvokeOptions<
            { name: string } | undefined,
            string,
            Error
          >;
        }) => ({
          invoke: invokeFn,
          isIdle: { value: false } as { value: boolean },
          isPending: { value: false } as { value: boolean },
          isSuccess: { value: true } as { value: boolean },
          isError: { value: false } as { value: boolean },
          error: { value: null } as { value: null },
          data: {
            value: (_params
              ? `Hello ${_params.name}`
              : 'Hello') as string | undefined,
          },
          reset: vi.fn(),
          native: undefined as unknown as VueMutationReactiveReturnType<
            { name: string } | undefined,
            string,
            Error
          >,
        }),
      );
      const reactiveMutation = markReactive(
        { useHook: fn },
        TYPE_MARKERS.REACTIVE_MUTATION,
      );
      return {
        fn,
        invokeFn,
        reactiveMutation,
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
