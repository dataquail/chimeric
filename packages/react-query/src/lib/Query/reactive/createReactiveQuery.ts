import {
  createReactiveQuery as coreCreateReactiveQuery,
  ReactiveQuery as CoreReactiveQuery,
} from '@chimeric/core';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactiveReturnType,
} from './types';
import { QueryKey } from '@tanstack/react-query';

export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  reactiveFn: CoreReactiveQuery<
    TParams,
    TResult,
    TError,
    TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>,
    TanstackQueryReactiveReturnType<TResult, TError>
  >['useQuery'],
): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateReactiveQuery(reactiveFn) as ReactiveQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
