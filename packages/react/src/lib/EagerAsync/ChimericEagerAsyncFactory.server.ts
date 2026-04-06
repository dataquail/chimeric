import { ChimericEagerAsync, fuseChimericEagerAsync, createReactiveEagerAsync } from '@chimeric/core';
import { IdiomaticEagerAsyncFactory } from './IdiomaticEagerAsyncFactory';
import { throwHookServerError } from '../serverErrors';

// Required params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams, TResult, TError>;

// Optional params
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: (params?: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams | undefined, TResult, TError>;

// No params
export function ChimericEagerAsyncFactory<
  TResult = unknown,
  TError extends Error = Error,
>(config: {
  eagerAsyncFn: () => Promise<TResult>;
}): ChimericEagerAsync<void, TResult, TError>;

// Implementation
export function ChimericEagerAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  eagerAsyncFn,
}: {
  eagerAsyncFn: (params: TParams) => Promise<TResult>;
}): ChimericEagerAsync<TParams, TResult, TError> {
  const idiomatic = IdiomaticEagerAsyncFactory({ eagerAsyncFn });
  const stubUseHook = () => throwHookServerError('useHook');
  const reactive = createReactiveEagerAsync(stubUseHook);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fuseChimericEagerAsync({ idiomatic, reactive } as any) as any;
}
