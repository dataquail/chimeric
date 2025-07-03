import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import {
  QueryKey,
  TanstackQueryIdiomaticNativeOptions,
} from '@chimeric/react-query';
import { IdiomaticQueryTestHarness as CoreIdiomaticQueryTestHarness } from '@chimeric/testing-core';
import { IdiomaticQueryTestHarnessReturnType } from './types.js';

export function IdiomaticQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends void
    ? {
        idiomaticQuery: IdiomaticQuery<
          TParams,
          TResult,
          TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
        >;
        options?: IdiomaticQueryOptions;
        nativeOptions?: TanstackQueryIdiomaticNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      }
    : {
        idiomaticQuery: IdiomaticQuery<
          TParams,
          TResult,
          TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
        >;
        params: TParams;
        options?: IdiomaticQueryOptions;
        nativeOptions?: TanstackQueryIdiomaticNativeOptions<
          TResult,
          TError,
          TQueryKey
        >;
      },
): IdiomaticQueryTestHarnessReturnType<TResult, TError> {
  return CoreIdiomaticQueryTestHarness(args);
}
