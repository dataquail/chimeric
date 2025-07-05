import {
  IdiomaticMutationOptions,
  ReactiveMutationInvokeOptions,
} from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';
import { chimericMethods } from '../methods';

export type IdiomaticMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TIdiomaticNativeOptions = unknown,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      invoke: TParams extends object
        ? Omit<TParams, 'options' | 'nativeOptions'> extends
            | undefined
            | {
                options?: IdiomaticMutationOptions;
                nativeOptions?: TIdiomaticNativeOptions;
              }
          ? (config?: {
              options?: IdiomaticMutationOptions;
              nativeOptions?: TIdiomaticNativeOptions;
            }) => Promise<TResult>
          : (
              paramsAndConfig: TParams & {
                options?: IdiomaticMutationOptions;
                nativeOptions?: TIdiomaticNativeOptions;
              },
            ) => Promise<TResult>
        : TParams extends void
        ? (
            config?:
              | {
                  options?: IdiomaticMutationOptions;
                  nativeOptions?: TIdiomaticNativeOptions;
                }
              | TParams,
          ) => Promise<TResult>
        : never;
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
};

export type ReactiveMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      invoke: TParams extends object
        ? Omit<TParams, 'options' | 'nativeOptions'> extends
            | undefined
            | {
                options?: ReactiveMutationInvokeOptions;
                nativeOptions?: TNativeInvokeOptions;
              }
          ? (
              config?: TParams & {
                options?: ReactiveMutationInvokeOptions;
                nativeOptions?: TNativeInvokeOptions;
              },
            ) => Promise<TResult>
          : (
              paramsAndConfig: TParams & {
                options?: ReactiveMutationInvokeOptions;
                nativeOptions?: TNativeInvokeOptions;
              },
            ) => Promise<TResult>
        : TParams extends void
        ? (
            config?:
              | {
                  options?: ReactiveMutationInvokeOptions;
                  nativeOptions?: TNativeInvokeOptions;
                }
              | TParams,
          ) => Promise<TResult>
        : never;
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
      native: TNativeReturnType;
    };
  };
};

export type ChimericMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = TMethod extends 'idiomatic'
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
