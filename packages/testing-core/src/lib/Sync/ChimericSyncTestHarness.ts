import { ChimericSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { SyncTestHarnessReturnType } from './types.js';
import { IdiomaticSyncTestHarness } from './IdiomaticSyncTestHarness.js';
import { ReactiveSyncTestHarness } from './ReactiveSyncTestHarness.js';

// Required params (must come first - most specific)
export function ChimericSyncTestHarness<TParams, TResult>(args: {
  chimericSync: ChimericSync<TParams, TResult>;
  method: (typeof chimericMethods)[number];
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// Optional params (must come before no params)
export function ChimericSyncTestHarness<TParams, TResult>(args: {
  chimericSync: ChimericSync<TParams | undefined, TResult>;
  method: (typeof chimericMethods)[number];
  params?: TParams | undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// No params (least specific - must come last)
export function ChimericSyncTestHarness<TResult>(args: {
  chimericSync: ChimericSync<void, TResult>;
  method: (typeof chimericMethods)[number];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult>;

// Implementation
export function ChimericSyncTestHarness<
  TParams = void,
  TResult = unknown,
>(args: {
  chimericSync: ChimericSync<TParams, TResult>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult> {
  const { chimericSync, method } = args;
  const params = (args as { params?: TParams })?.params as TParams;
  const wrapper = (
    args as { wrapper?: ({ children }: { children: ReactNode }) => JSX.Element }
  )?.wrapper;
  if (method === 'idiomatic') {
    return IdiomaticSyncTestHarness({
      idiomaticSync: chimericSync,
      params,
    });
  } else {
    return ReactiveSyncTestHarness({
      reactiveSync: chimericSync,
      params,
      wrapper,
    });
  }
}
