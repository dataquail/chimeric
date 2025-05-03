import {
  IdiomaticMutationOptions,
  ReactiveMutationCallOptions,
} from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';
import { chimericMethods } from '../methods';

export type IdiomaticMutationTestHarnessReturnType<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TIdiomaticNativeOptions = unknown,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: TParams extends undefined
        ? (params?: {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TIdiomaticNativeOptions;
          }) => Promise<TResult>
        : (
            params: TParams & {
              options?: IdiomaticMutationOptions;
              nativeOptions?: TIdiomaticNativeOptions;
            },
          ) => Promise<TResult>;
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
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: TParams extends undefined
        ? (params?: {
            options?: ReactiveMutationCallOptions;
            nativeOptions?: TNativeCallOptions;
          }) => Promise<TResult>
        : (
            params: TParams & {
              options?: ReactiveMutationCallOptions;
              nativeOptions?: TNativeCallOptions;
            },
          ) => Promise<TResult>;
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
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TIdiomaticNativeOptions = unknown,
  TNativeCallOptions = unknown,
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
      TNativeCallOptions,
      TNativeReturnType
    >;
