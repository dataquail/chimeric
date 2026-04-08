import { ReactiveEagerAsync } from '@chimeric/core';
import { throwReactiveServerError } from '../serverErrors';

// Required params
export function ReactiveEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ReactiveEagerAsync<TParams, TResult, TError>;

// Optional params
export function ReactiveEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): ReactiveEagerAsync<TParams | undefined, TResult, TError>;

// No params
export function ReactiveEagerAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): ReactiveEagerAsync<void, TResult, TError>;

// Implementation
export function ReactiveEagerAsyncFactory(
   
  _config: { eagerAsyncFn: unknown },
): never {
  throwReactiveServerError('ReactiveEagerAsyncFactory');
}
