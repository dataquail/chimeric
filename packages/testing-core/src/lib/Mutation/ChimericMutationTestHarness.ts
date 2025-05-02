import { JSX, ReactNode } from 'react';
import { ChimericMutation, ReactiveMutationOptions } from '@chimeric/core';
import { chimericMethods } from '../methods.js';
import { IdiomaticMutationTestHarness } from './IdiomaticMutationTestHarness.js';
import { ReactiveMutationTestHarness } from './ReactiveMutationTestHarness.js';
import {
  IdiomaticMutationTestHarnessReturnType,
  ReactiveMutationTestHarnessReturnType,
} from './types.js';

// Overloads
export function ChimericMutationTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  chimericMutation: ChimericMutation<
    undefined,
    TResult,
    E,
    TIdiomaticNativeOptions,
    TNativeReactiveOptions,
    TNativeCallOptions,
    TNativeReturnType
  >;
  method: TMethod;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
  options?: TMethod extends 'idiomatic' ? never : ReactiveMutationOptions;
  nativeOptions?: TMethod extends 'idiomatic' ? never : TNativeReactiveOptions;
}): TMethod extends 'idiomatic'
  ? IdiomaticMutationTestHarnessReturnType<
      undefined,
      TResult,
      E,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      undefined,
      TResult,
      E,
      TNativeCallOptions,
      TNativeReturnType
    >;
export function ChimericMutationTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  chimericMutation: ChimericMutation<
    TParams,
    TResult,
    E,
    TIdiomaticNativeOptions,
    TNativeReactiveOptions,
    TNativeCallOptions,
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
      TNativeCallOptions,
      TNativeReturnType
    >;

// Implementation
export function ChimericMutationTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
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
    TNativeCallOptions,
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
      TNativeCallOptions,
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
          TNativeCallOptions,
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
          TNativeCallOptions,
          TNativeReturnType
        >;
  }
}
