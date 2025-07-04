import { ChimericSync, IdiomaticSync, ReactiveSync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { SyncTestHarnessReturnType } from './types.js';
import { IdiomaticSyncTestHarness } from './IdiomaticSyncTestHarness.js';
import { ReactiveSyncTestHarness } from './ReactiveSyncTestHarness.js';

export const ChimericSyncTestHarness = <TParams = void, TResult = unknown>(
  args: TParams extends void | undefined
    ? {
        chimericSync: ChimericSync<TParams, TResult>;
        method: (typeof chimericMethods)[number];
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        chimericSync: ChimericSync<TParams, TResult>;
        method: (typeof chimericMethods)[number];
        params: TParams;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): SyncTestHarnessReturnType<TResult> => {
  const { chimericSync, method } = args;
  const params = (args as { params?: TParams })?.params as TParams;
  const wrapper = (
    args as { wrapper?: ({ children }: { children: ReactNode }) => JSX.Element }
  )?.wrapper;
  if (method === 'idiomatic') {
    return IdiomaticSyncTestHarness({
      idiomaticSync: chimericSync,
      params,
    } as unknown as TParams extends void | undefined ? { idiomaticSync: IdiomaticSync<TParams, TResult> } : { idiomaticSync: IdiomaticSync<TParams, TResult>; params: TParams });
  } else {
    return ReactiveSyncTestHarness({
      reactiveSync: chimericSync,
      params,
      wrapper,
    } as unknown as TParams extends void | undefined ? { reactiveSync: ReactiveSync<TParams, TResult>; wrapper?: ({ children }: { children: ReactNode }) => JSX.Element } : { reactiveSync: ReactiveSync<TParams, TResult>; params: TParams; wrapper?: ({ children }: { children: ReactNode }) => JSX.Element });
  }
};
