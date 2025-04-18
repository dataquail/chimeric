import { JSX, ReactNode } from 'react';
import { ChimericMutation } from '@chimeric/core';
import { chimericMethods } from '../methods.js';
import { IdiomaticMutationTestHarness } from './IdiomaticMutationTestHarness.js';
import { ReactiveMutationTestHarness } from './ReactiveMutationTestHarness.js';
import { MutationTestHarness } from './types.js';

// Overloads
export function ChimericMutationTestHarness<
  TParams extends void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): MutationTestHarness<TParams, TResult, E>;
export function ChimericMutationTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): MutationTestHarness<TParams, TResult, E>;

// Implementation
export function ChimericMutationTestHarness<
  TParams extends object,
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
}): MutationTestHarness<TParams, TResult, E> {
  if (method === 'idiomatic') {
    return IdiomaticMutationTestHarness({
      idiomaticMutation: chimericMutation,
    }) as MutationTestHarness<TParams, TResult, E>;
  } else {
    return ReactiveMutationTestHarness({
      reactiveMutation: chimericMutation,
      wrapper,
    }) as MutationTestHarness<TParams, TResult, E>;
  }
}
