import { ChimericSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { SyncTestHarness } from './types .js';
import { IdiomaticSyncTestHarness } from './IdiomaticSyncTestHarness.js';
import { ReactiveSyncTestHarness } from './ReactiveSyncTestHarness.js';

export const ChimericSyncTestHarness = <
  TParams = undefined,
  TResult = unknown,
>({
  chimericSync,
  method,
  params,
  wrapper,
}: {
  chimericSync: ChimericSync<TParams, TResult>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): SyncTestHarness<TResult> => {
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
