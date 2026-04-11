import { createIdiomaticMutation as coreCreateIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutation } from './types';

// No params
export function createIdiomaticMutation<
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: () => Promise<TResult>,
): IdiomaticMutation<void, TResult, TError>;

// Optional params
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: (params?: TParams) => Promise<TResult>,
): IdiomaticMutation<TParams | undefined, TResult, TError>;

// Required params
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticMutation<TParams, TResult, TError>;

// Implementation
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idiomaticFn: (params: any) => Promise<TResult>,
): IdiomaticMutation<TParams, TResult, TError> {
  return coreCreateIdiomaticMutation(idiomaticFn) as IdiomaticMutation<
    TParams,
    TResult,
    TError
  >;
}
