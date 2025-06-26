import { JSX, ReactNode } from 'react';
import { ReactiveMutationOptions } from '@chimeric/core';
import {
  ChimericMutation,
  TanstackMutationReactiveNativeOptions,
} from '@chimeric/react-query';
import { ChimericMutationTestHarnessReturnType } from './types.js';
import {
  chimericMethods,
  ChimericMutationTestHarness as CoreChimericMutationTestHarness,
} from '@chimeric/testing-core';

export function ChimericMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
>(args: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  method: TMethod;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: TMethod extends 'idiomatic' ? never : ReactiveMutationOptions;
  nativeOptions?: TMethod extends 'idiomatic'
    ? never
    : TanstackMutationReactiveNativeOptions<TParams, TResult, E>;
}): ChimericMutationTestHarnessReturnType<TParams, TResult, E, TMethod> {
  return CoreChimericMutationTestHarness(
    args,
  ) as unknown as ChimericMutationTestHarnessReturnType<
    TParams,
    TResult,
    E,
    TMethod
  >;
}
