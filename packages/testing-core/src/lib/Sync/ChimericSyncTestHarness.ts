import { ChimericSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { SyncTestHarnessReturnType } from './types.js';
import { IdiomaticSyncTestHarness } from './IdiomaticSyncTestHarness.js';
import { ReactiveSyncTestHarness } from './ReactiveSyncTestHarness.js';

export const ChimericSyncTestHarness = <TParams, TResult>({
  chimericSync,
  method,
  params,
  wrapper,
}: {
  chimericSync: ChimericSync<TParams, TResult>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarnessReturnType<TResult> => {
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
};
