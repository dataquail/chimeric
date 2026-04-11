import {
  DefineChimericAsync,
  DefineIdiomaticAsync,
  DefineReactiveAsync,
} from '@chimeric/core';

export const AsyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as DefineIdiomaticAsync<() => Promise<string>>,
      };
    },
    getReactive: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as DefineReactiveAsync<() => Promise<string>>,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as DefineChimericAsync<() => Promise<string>>,
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
        annotation: {} as DefineIdiomaticAsync<
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
        annotation: {} as DefineReactiveAsync<
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
        annotation: {} as DefineChimericAsync<
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
        annotation: {} as DefineIdiomaticAsync<
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
        annotation: {} as DefineReactiveAsync<
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
        annotation: {} as DefineChimericAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
