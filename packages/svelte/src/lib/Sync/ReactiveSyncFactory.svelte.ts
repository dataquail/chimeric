import { ReactiveSync, createReactiveSync } from '@chimeric/core';
import type { ReactiveSyncBox } from './types';

// Optional params
export function ReactiveSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params?: TParams) => TResult,
): ReactiveSync<TParams | undefined, ReactiveSyncBox<TResult>>;

// No params
export function ReactiveSyncFactory<TResult = unknown>(
  syncFn: () => TResult,
): ReactiveSync<void, ReactiveSyncBox<TResult>>;

// Required params
export function ReactiveSyncFactory<TParams, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): ReactiveSync<TParams, ReactiveSyncBox<TResult>>;

// Implementation
export function ReactiveSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): ReactiveSync<TParams, ReactiveSyncBox<TResult>> {
  const reactiveFn = (params: TParams): ReactiveSyncBox<TResult> => {
    const derived = $derived.by(() => syncFn(params));
    return {
      get current() {
        return derived;
      },
    };
  };

  return createReactiveSync(reactiveFn) as ReactiveSync<
    TParams,
    ReactiveSyncBox<TResult>
  >;
}
