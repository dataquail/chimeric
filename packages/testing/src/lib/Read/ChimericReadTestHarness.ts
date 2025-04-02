import { ChimericRead } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { ReadTestHarness } from './types.js';
import { IdiomaticReadTestHarness } from './IdiomaticReadTestHarness.js';
import { ReactiveReadTestHarness } from './ReactiveReadTestHarness.js';

export const ChimericReadTestHarness = <TParams, TResult>({
  chimericRead,
  method,
  params,
  wrapper,
}: {
  chimericRead: ChimericRead<TParams, TResult>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReadTestHarness<TResult> => {
  if (method === 'idiomatic') {
    return IdiomaticReadTestHarness({
      idiomaticRead: chimericRead,
      params,
    });
  } else {
    return ReactiveReadTestHarness({
      reactiveRead: chimericRead,
      params,
      wrapper,
    });
  }
};
