import { JSX, ReactNode } from 'react';
import { ChimericMutation, ReactiveMutationOptions } from '@chimeric/core';
import { chimericMethods } from '../methods.js';
import { IdiomaticMutationTestHarness } from './IdiomaticMutationTestHarness.js';
import { ReactiveMutationTestHarness } from './ReactiveMutationTestHarness.js';
import {
  IdiomaticMutationTestHarnessReturnType,
  ReactiveMutationTestHarnessReturnType,
} from './types.js';

export function ChimericMutationTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>({
  chimericMutation,
  method,
  wrapper,
  options,
  nativeOptions,
}: {
  chimericMutation: ChimericMutation<
    TParams,
    TResult,
    E,
    TIdiomaticNativeOptions,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  method: TMethod;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: TMethod extends 'idiomatic' ? never : ReactiveMutationOptions;
  nativeOptions?: TMethod extends 'idiomatic' ? never : TNativeReactiveOptions;
}): TMethod extends 'idiomatic'
  ? IdiomaticMutationTestHarnessReturnType<
      TParams,
      TResult,
      E,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      TParams,
      TResult,
      E,
      TNativeInvokeOptions,
      TNativeReturnType
    > {
  if (method === 'idiomatic') {
    return IdiomaticMutationTestHarness({
      idiomaticMutation: chimericMutation,
    }) as TMethod extends 'idiomatic'
      ? IdiomaticMutationTestHarnessReturnType<
          TParams,
          TResult,
          E,
          TIdiomaticNativeOptions
        >
      : ReactiveMutationTestHarnessReturnType<
          TParams,
          TResult,
          E,
          TNativeInvokeOptions,
          TNativeReturnType
        >;
  } else {
    return ReactiveMutationTestHarness({
      reactiveMutation: chimericMutation,
      wrapper,
      options,
      nativeOptions,
    }) as unknown as TMethod extends 'idiomatic'
      ? IdiomaticMutationTestHarnessReturnType<
          TParams,
          TResult,
          E,
          TIdiomaticNativeOptions
        >
      : ReactiveMutationTestHarnessReturnType<
          TParams,
          TResult,
          E,
          TNativeInvokeOptions,
          TNativeReturnType
        >;
  }
}
