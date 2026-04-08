import { ReactiveAsync } from '@chimeric/core';
import { throwReactiveServerError } from '../serverErrors';

// Optional params
export function ReactiveAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params?: TParams) => Promise<TResult>,
): ReactiveAsync<TParams | undefined, TResult, TError>;

// No params
export function ReactiveAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(asyncFn: () => Promise<TResult>): ReactiveAsync<void, TResult, TError>;

// Required params
export function ReactiveAsyncFactory<
  TParams,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams, TResult, TError>;

// Implementation
export function ReactiveAsyncFactory(
   
  _asyncFn: unknown,
): never {
  throwReactiveServerError('ReactiveAsyncFactory');
}
