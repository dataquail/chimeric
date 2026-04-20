import { IdiomaticSync, createIdiomaticSync } from '@chimeric/core';

// Optional params
export function IdiomaticSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params?: TParams) => TResult,
): IdiomaticSync<TParams | undefined, TResult>;

// No params
export function IdiomaticSyncFactory<TResult = unknown>(
  syncFn: () => TResult,
): IdiomaticSync<void, TResult>;

// Required params
export function IdiomaticSyncFactory<TParams, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): IdiomaticSync<TParams, TResult>;

// Implementation
export function IdiomaticSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): IdiomaticSync<TParams, TResult> {
  return createIdiomaticSync(syncFn) as IdiomaticSync<TParams, TResult>;
}
