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
      invoke: [TParams] extends [void]
        ? (allOptions?: {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TIdiomaticNativeOptions;
          }) => Promise<TResult>
        : void extends TParams
        ? (allOptions?: {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TIdiomaticNativeOptions;
          }) => Promise<TResult>
        : undefined extends TParams
        ? (
            params?: TParams,
            allOptions?: {
              options?: IdiomaticMutationOptions;
              nativeOptions?: TIdiomaticNativeOptions;
            },
          ) => Promise<TResult>
        : (
            params: TParams,
            allOptions?: {
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
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      invoke: [TParams] extends [void]
        ? (allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TNativeInvokeOptions;
          }) => Promise<TResult>
        : void extends TParams
        ? (allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TNativeInvokeOptions;
          }) => Promise<TResult>
        : undefined extends TParams
        ? (
            params?: TParams,
            allInvokeOptions?: {
              options?: ReactiveMutationInvokeOptions;
              nativeOptions?: TNativeInvokeOptions;
            },
          ) => Promise<TResult>
        : (
            params: TParams,
            allInvokeOptions?: {
              options?: ReactiveMutationInvokeOptions;
              nativeOptions?: TNativeInvokeOptions;
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
