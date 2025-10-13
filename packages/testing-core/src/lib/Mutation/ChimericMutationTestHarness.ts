import { JSX, ReactNode } from 'react';
import {
  ChimericMutation,
  IdiomaticMutation,
  ReactiveMutationOptions,
} from '@chimeric/core';
import { chimericMethods } from '../methods.js';
import { IdiomaticMutationTestHarness } from './IdiomaticMutationTestHarness.js';
import { ReactiveMutationTestHarness } from './ReactiveMutationTestHarness.js';
import {
  IdiomaticMutationTestHarnessReturnType,
  ReactiveMutationTestHarnessReturnType,
} from './types.js';

// No params
export function ChimericMutationTestHarness<
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>({
  chimericMutation,
  method,
}: {
  chimericMutation: ChimericMutation<
    void,
    TResult,
    TError,
    TIdiomaticNativeOptions,
    TNativeReactiveOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >;
  method: TMethod;
}): TMethod extends 'idiomatic'
  ? IdiomaticMutationTestHarnessReturnType<
      void,
      TResult,
      TError,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      void,
      TResult,
      TError,
      TNativeInvokeOptions,
      TNativeReturnType
    >;

// Optional params
export function ChimericMutationTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
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
    TParams | undefined,
    TResult,
    TError,
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
      TParams | undefined,
      TResult,
      TError,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      TParams | undefined,
      TResult,
      TError,
      TNativeInvokeOptions,
      TNativeReturnType
    >;

// Required params
export function ChimericMutationTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
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
    TError,
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
      TError,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      TParams,
      TResult,
      TError,
      TNativeInvokeOptions,
      TNativeReturnType
    >;

// Implementation
export function ChimericMutationTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
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
    TError,
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
      TError,
      TIdiomaticNativeOptions
    >
  : ReactiveMutationTestHarnessReturnType<
      TParams,
      TResult,
      TError,
      TNativeInvokeOptions,
      TNativeReturnType
    > {
  if (method === 'idiomatic') {
    return IdiomaticMutationTestHarness({
      idiomaticMutation: chimericMutation as IdiomaticMutation<
        TParams,
        TResult,
        TIdiomaticNativeOptions
      >,
    }) as TMethod extends 'idiomatic'
      ? IdiomaticMutationTestHarnessReturnType<
          TParams,
          TResult,
          TError,
          TIdiomaticNativeOptions
        >
      : ReactiveMutationTestHarnessReturnType<
          TParams,
          TResult,
          TError,
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
          TError,
          TIdiomaticNativeOptions
        >
      : ReactiveMutationTestHarnessReturnType<
          TParams,
          TResult,
          TError,
          TNativeInvokeOptions,
          TNativeReturnType
        >;
  }
}
