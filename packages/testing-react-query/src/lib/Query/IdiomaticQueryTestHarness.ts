import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import { TanstackQueryIdiomaticNativeOptions } from '@chimeric/react-query';
import { IdiomaticQueryTestHarness as CoreIdiomaticQueryTestHarness } from '@chimeric/testing-core';
import { IdiomaticQueryTestHarnessReturnType } from './types.js';
// Overloads
export function IdiomaticQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticQuery: IdiomaticQuery<undefined, TResult>;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<TResult, E>;
}): IdiomaticQueryTestHarnessReturnType<TResult, E>;
export function IdiomaticQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult>;
  params: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<TResult, E>;
}): IdiomaticQueryTestHarnessReturnType<TResult, E>;

// Implementation
export function IdiomaticQueryTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomaticQuery: IdiomaticQuery<TParams, TResult>;
  params?: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<TResult, E>;
}): IdiomaticQueryTestHarnessReturnType<TResult, E> {
  return CoreIdiomaticQueryTestHarness<TResult, E>(
    args as {
      idiomaticQuery: IdiomaticQuery<undefined, TResult>;
      options?: IdiomaticQueryOptions;
      nativeOptions?: TanstackQueryIdiomaticNativeOptions<TResult, E>;
    },
  );
}
