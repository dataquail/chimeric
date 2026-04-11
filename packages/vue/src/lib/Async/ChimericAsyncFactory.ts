import { fuseChimericAsync, type ReactiveAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';
import { VueChimericAsync } from './types';

// Optional params
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params?: TParams) => Promise<TResult>,
): VueChimericAsync<TParams | undefined, TResult, TError>;

// No params
export function ChimericAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(asyncFn: () => Promise<TResult>): VueChimericAsync<void, TResult, TError>;

// Required params
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): VueChimericAsync<TParams, TResult, TError>;

// Implementation
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): VueChimericAsync<TParams, TResult, TError> {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn) as unknown as ReactiveAsync<TParams, TResult, TError>,
  }) as unknown as VueChimericAsync<TParams, TResult, TError>;
}
