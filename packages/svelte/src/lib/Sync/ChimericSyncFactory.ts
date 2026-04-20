/* eslint-disable @typescript-eslint/no-explicit-any */
import { fuseChimericSync } from '@chimeric/core';
import { IdiomaticSyncFactory } from './IdiomaticSyncFactory';
import { ReactiveSyncFactory } from './ReactiveSyncFactory.svelte';
import type { ChimericSyncSvelte } from './types';

// Optional params
export function ChimericSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params?: TParams) => TResult,
): ChimericSyncSvelte<TParams | undefined, TResult>;

// No params
export function ChimericSyncFactory<TResult = unknown>(
  syncFn: () => TResult,
): ChimericSyncSvelte<void, TResult>;

// Required params
export function ChimericSyncFactory<TParams, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): ChimericSyncSvelte<TParams, TResult>;

// Implementation
export function ChimericSyncFactory<TParams = void, TResult = unknown>(
  syncFn: (params: TParams) => TResult,
): ChimericSyncSvelte<TParams, TResult> {
  const idiomatic = IdiomaticSyncFactory(syncFn);
  const reactive = ReactiveSyncFactory(syncFn);
  // fuseChimericSync properly marks the result with REACTIVE_SYNC and IDIOMATIC_SYNC
  // so that isReactiveSync() recognises it. We cast reactive's useHook (which returns
  // ReactiveSyncBox<TResult>) to satisfy the core's TResult generic.
  return fuseChimericSync({
    idiomatic,
    reactive: reactive as any,
  }) as unknown as ChimericSyncSvelte<TParams, TResult>;
}
