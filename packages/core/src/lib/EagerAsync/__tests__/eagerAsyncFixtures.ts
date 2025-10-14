import { DefineChimericEagerAsync } from '../chimeric/types';
import { createIdiomaticEagerAsync } from '../idiomatic/createIdiomaticEagerAsync';
import {
  DefineIdiomaticEagerAsync,
  IdiomaticEagerAsyncOptions,
} from '../idiomatic/types';
import { createReactiveEagerAsync } from '../reactive/createReactiveEagerAsync';
import {
  DefineReactiveEagerAsync,
  ReactiveEagerAsyncOptions,
} from '../reactive/types';

export const EagerAsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: (_options?: IdiomaticEagerAsyncOptions) => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
        annotation: {} as DefineIdiomaticEagerAsync<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const fn = vi.fn((_options?: ReactiveEagerAsyncOptions) => ({
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
        annotation: {} as DefineReactiveEagerAsync<() => Promise<string>>,
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
        annotation: {} as DefineChimericEagerAsync<() => Promise<string>>,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
        annotation: {} as DefineIdiomaticEagerAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const fn = vi.fn((params: { name: string }) => {
        _params = params;
        return {
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: `Hello ${_params.name}` as string | undefined,
        };
      });
      return {
        fn,
        reactiveEagerAsync: createReactiveEagerAsync(fn),
        annotation: {} as DefineReactiveEagerAsync<
          (params: { name: string }) => Promise<string>
        >,
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
        annotation: {} as DefineChimericEagerAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async (params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        idiomaticEagerAsync: createIdiomaticEagerAsync(fn),
        annotation: {} as DefineIdiomaticEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn((params?: { name: string }) => {
        // Capture params for this specific call
        const capturedParams = params;
        return {
          isIdle: false,
          isPending: false,
          isSuccess: true,
          isError: false,
          error: null,
          data: (capturedParams ? `Hello ${capturedParams.name}` : 'Hello') as
            | string
            | undefined,
        };
      });
      return {
        fn,
        reactiveEagerAsync: createReactiveEagerAsync(fn),
        annotation: {} as DefineReactiveEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
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
        annotation: {} as DefineChimericEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
