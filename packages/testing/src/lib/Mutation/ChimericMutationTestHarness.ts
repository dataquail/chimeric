import { JSX, ReactNode } from 'react';
import { ChimericMutation } from '@chimeric/core';
import { chimericMethods } from '../methods.js';
import { IdiomaticMutationTestHarness } from './IdiomaticMutationTestHarness.js';
import { ReactiveMutationTestHarness } from './ReactiveMutationTestHarness.js';
import { MutationTestHarness } from './types.js';

export const ChimericMutationTestHarness = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  chimericMutation,
  method,
  wrapper,
}: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): MutationTestHarness<TParams, TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticMutationTestHarness({
      idiomaticMutation: chimericMutation,
    });
  } else {
    return ReactiveMutationTestHarness({
      reactiveMutation: chimericMutation,
      wrapper,
    });
  }
};
