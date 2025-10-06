import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { ChimericQueryTestHarnessReturnType } from './types.js';
import {
  QueryKey,
  ChimericQuery,
  TanstackQueryIdiomaticNativeOptions,
  TanstackQueryReactiveNativeOptions,
} from '@chimeric/react-query';
import {
  chimericMethods,
  ChimericQueryTestHarness as CoreChimericQueryTestHarness,
} from '@chimeric/testing-core';

export function ChimericQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends object
    ? Omit<TParams, 'options' | 'nativeOptions'> extends
        | undefined
        | {
            options?: ReactiveQueryOptions;
            nativeOptions?: TanstackQueryReactiveNativeOptions<
              TResult,
              TError,
              TQueryKey
            >;
          }
      ? {
          chimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>;
          method: TMethod;
          params: TParams;
          reactiveOptions?: ReactiveQueryOptions;
          reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
            TResult,
            TError,
            TQueryKey
          >;
          idiomaticOptions?: IdiomaticQueryOptions;
          idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
            TResult,
            TError,
            TQueryKey
          >;
          wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
        }
      : {
          chimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>;
          method: TMethod;
          params: TParams;
          reactiveOptions?: ReactiveQueryOptions;
          reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
            TResult,
            TError,
            TQueryKey
          >;
          idiomaticOptions?: IdiomaticQueryOptions;
          idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
            TResult,
            TError,
            TQueryKey
          >;
          wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
        }
    : TParams extends void
    ? {
        chimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>;
        method: TMethod;
        reactiveOptions?: ReactiveQueryOptions;
        reactiveNativeOptions?: TanstackQueryReactiveNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
        idiomaticOptions?: IdiomaticQueryOptions;
        idiomaticNativeOptions?: TanstackQueryIdiomaticNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : never,
): ChimericQueryTestHarnessReturnType<TResult, TError, TMethod> {
  return CoreChimericQueryTestHarness(
    args as any, // TS can't seem to infer the type here correctly
  ) as ChimericQueryTestHarnessReturnType<TResult, TError, TMethod>;
}
