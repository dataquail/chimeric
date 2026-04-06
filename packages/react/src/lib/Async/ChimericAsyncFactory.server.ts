import { ChimericAsync, fuseChimericAsync, createReactiveAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { throwHookServerError } from '../serverErrors';

// Optional params
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params?: TParams) => Promise<TResult>,
): ChimericAsync<TParams | undefined, TResult, TError>;

// No params
export function ChimericAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(asyncFn: () => Promise<TResult>): ChimericAsync<void, TResult, TError>;

// Required params
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams, TResult, TError>;

// Implementation
export function ChimericAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ChimericAsync<TParams, TResult, TError> {
  const idiomatic = IdiomaticAsyncFactory(asyncFn);
  const stubUseHook = () => throwHookServerError('useHook');
  const reactive = createReactiveAsync(stubUseHook);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fuseChimericAsync({ idiomatic, reactive } as any) as any;
}
