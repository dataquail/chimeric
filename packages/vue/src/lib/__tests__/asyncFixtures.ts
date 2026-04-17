import {
  DefineIdiomaticAsync,
} from '@chimeric/core';
import {
  VueDefineReactiveAsync,
  VueDefineChimericAsync,
} from '../Async/types';

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
        annotation: {} as VueDefineReactiveAsync<() => Promise<string>>,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(async () => 'test');
      return {
        fn,
        annotation: {} as VueDefineChimericAsync<() => Promise<string>>,
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
        annotation: {} as VueDefineReactiveAsync<
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
        annotation: {} as VueDefineChimericAsync<
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
        annotation: {} as VueDefineReactiveAsync<
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
        annotation: {} as VueDefineChimericAsync<
          (params?: { name: string }) => Promise<string>
        >,
      };
    },
  },
};
