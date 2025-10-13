import { createIdiomaticSync, createReactiveSync } from '@chimeric/core';

export const SyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(() => 'test');
      return {
        fn,
        idiomaticSync: createIdiomaticSync(fn),
      };
    },
    getReactive: () => {
      const fn = vi.fn(() => 'test');
      return {
        fn,
        reactiveSync: createReactiveSync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticSync, fn: idiomaticFn } =
        SyncTestFixtures.withoutParams.getIdiomatic();
      const { reactiveSync, fn: reactiveFn } =
        SyncTestFixtures.withoutParams.getReactive();
      return {
        idiomaticSync,
        idiomaticFn,
        reactiveSync,
        reactiveFn,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn((params: { name: string }) => `Hello ${params.name}`);
      return {
        fn,
        idiomaticSync: createIdiomaticSync(fn),
      };
    },
    getReactive: () => {
      const fn = vi.fn((params: { name: string }) => `Hello ${params.name}`);
      return {
        fn,
        reactiveSync: createReactiveSync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticSync, fn: idiomaticFn } =
        SyncTestFixtures.withParams.getIdiomatic();
      const { reactiveSync, fn: reactiveFn } =
        SyncTestFixtures.withParams.getReactive();
      return {
        idiomaticSync,
        idiomaticFn,
        reactiveSync,
        reactiveFn,
      };
    },
  },
  withOptionalParams: {
    getIdiomatic: () => {
      const fn = vi.fn((params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        idiomaticSync: createIdiomaticSync(fn),
      };
    },
    getReactive: () => {
      const fn = vi.fn((params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        reactiveSync: createReactiveSync(fn),
      };
    },
    getChimeric: () => {
      const { idiomaticSync, fn: idiomaticFn } =
        SyncTestFixtures.withOptionalParams.getIdiomatic();
      const { reactiveSync, fn: reactiveFn } =
        SyncTestFixtures.withOptionalParams.getReactive();
      return {
        idiomaticSync,
        idiomaticFn,
        reactiveSync,
        reactiveFn,
      };
    },
  },
};
