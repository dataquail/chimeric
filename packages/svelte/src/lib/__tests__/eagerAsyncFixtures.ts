import {
  DefineChimericEagerAsync,
  DefineIdiomaticEagerAsync,
  DefineReactiveEagerAsync,
} from '@chimeric/core';

export const EagerAsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as DefineIdiomaticEagerAsync<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as DefineReactiveEagerAsync<() => Promise<string>>,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
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
        annotation: {} as DefineIdiomaticEagerAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        async (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        annotation: {} as DefineReactiveEagerAsync<
          (params: { name: string }) => Promise<string>
        >,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(
        async (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
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
        annotation: {} as DefineIdiomaticEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(async (params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        annotation: {} as DefineReactiveEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(async (params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        annotation: {} as DefineChimericEagerAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
