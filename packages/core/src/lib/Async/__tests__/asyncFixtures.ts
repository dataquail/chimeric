import { DefineChimericAsync } from '../chimeric/types';
import { createIdiomaticAsync } from '../idiomatic/createIdiomaticAsync';
import { DefineIdiomaticAsync } from '../idiomatic/types';
import { createReactiveAsync } from '../reactive/createReactiveAsync';
import { DefineReactiveAsync } from '../reactive/types';

export const AsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
        annotation: {} as DefineIdiomaticAsync<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const invokeFn = vi.fn(async () => 'test');
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
        annotation: {} as DefineReactiveAsync<() => Promise<string>>,
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
        annotation: {} as DefineChimericAsync<() => Promise<string>>,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async (params: { name: string }) => `Hello ${params.name}`);
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
        annotation: {} as DefineIdiomaticAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string };
      const invokeFn = vi.fn(async (params: { name: string }) => {
        _params = params;
        return `Hello ${_params.name}`;
      });
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
        annotation: {} as DefineReactiveAsync<
          (params: { name: string }) => Promise<string>
        >,
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
        annotation: {} as DefineChimericAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        async (params?: { name: string }) =>
          params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        idiomaticAsync: createIdiomaticAsync(fn),
        annotation: {} as DefineIdiomaticAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      let _params: { name: string } | undefined;
      const invokeFn = vi.fn(async (params?: { name: string }) => {
        _params = params;
        return _params ? `Hello ${_params.name}` : 'Hello';
      });
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
        annotation: {} as DefineReactiveAsync<
          (params?: { name: string }) => Promise<string>
        >,
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
        annotation: {} as DefineChimericAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
