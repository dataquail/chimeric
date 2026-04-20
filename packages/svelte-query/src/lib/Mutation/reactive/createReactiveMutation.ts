import { createReactiveMutation as coreCreateReactiveMutation } from '@chimeric/core';
import { ReactiveMutation } from './types';

// No params
export function createReactiveMutation<
  TResult = unknown,
  TError extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactiveFn: (allOptions?: any) => any,
): ReactiveMutation<void, TResult, TError>;

// Optional params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactiveFn: (allOptions?: any) => any,
): ReactiveMutation<TParams | undefined, TResult, TError>;

// Required params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactiveFn: (allOptions?: any) => any,
): ReactiveMutation<TParams, TResult, TError>;

// Implementation
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactiveFn: (allOptions?: any) => any,
): ReactiveMutation<TParams, TResult, TError> {
  return coreCreateReactiveMutation(reactiveFn) as ReactiveMutation<
    TParams,
    TResult,
    TError
  >;
}
