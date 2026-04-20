import {
  DefineChimericSync,
  DefineIdiomaticSync,
} from '@chimeric/core';
import type { ReactiveSyncBox } from '../Sync/types';

/**
 * Creates a mutable, Svelte-reactive store used by sync factory tests. The
 * store's getter reads a `$state` field so that any consumer reading it
 * inside a reactive context will re-run when `set` is called.
 */
export const createReactiveStore = <T>(initial: T) => {
  let value = $state<T>(initial);
  return {
    get value() {
      return value;
    },
    set(next: T) {
      value = next;
    },
  };
};

type ReactiveSyncAnnotation<T extends (...args: never[]) => unknown> = {
  useHook: Parameters<T> extends []
    ? () => ReactiveSyncBox<ReturnType<T>>
    : (params: Parameters<T>[0]) => ReactiveSyncBox<ReturnType<T>>;
};

export const SyncTestFixtures = {
  withoutParams: {
    getIdiomatic: () => {
      const fn = vi.fn(() => 'test');
      return {
        fn,
        annotation: {} as DefineIdiomaticSync<() => string>,
      };
    },
    getReactive: () => {
      const fn = vi.fn(() => 'test');
      return {
        fn,
        annotation: {} as ReactiveSyncAnnotation<() => string>,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(() => 'test');
      const idiomaticAnnotation = {} as DefineIdiomaticSync<() => string>;
      const reactiveAnnotation = {} as ReactiveSyncAnnotation<() => string>;
      return {
        fn,
        annotation: undefined as unknown as typeof idiomaticAnnotation &
          typeof reactiveAnnotation,
        idiomaticAnnotation,
        reactiveAnnotation,
      };
    },
  },
  withParams: {
    getIdiomatic: () => {
      const fn = vi.fn(
        (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        annotation: {} as DefineIdiomaticSync<
          (params: { name: string }) => string
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn(
        (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        annotation: {} as ReactiveSyncAnnotation<
          (params: { name: string }) => string
        >,
      };
    },
    getChimeric: () => {
      const fn = vi.fn(
        (params: { name: string }) => `Hello ${params.name}`,
      );
      return {
        fn,
        annotation: {} as DefineChimericSync<
          (params: { name: string }) => string
        >,
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
        annotation: {} as DefineIdiomaticSync<
          (params?: { name: string }) => string
        >,
      };
    },
    getReactive: () => {
      const fn = vi.fn((params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        annotation: {} as ReactiveSyncAnnotation<
          (params?: { name: string }) => string
        >,
      };
    },
    getChimeric: () => {
      const fn = vi.fn((params?: { name: string }) =>
        params ? `Hello ${params.name}` : 'Hello',
      );
      return {
        fn,
        annotation: {} as DefineChimericSync<
          (params?: { name: string }) => string
        >,
      };
    },
  },
};
