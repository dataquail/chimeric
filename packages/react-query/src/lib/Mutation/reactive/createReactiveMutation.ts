import { createReactiveMutation as coreCreateReactiveMutation } from '@chimeric/core';
import { type ReactiveMutation } from './types';

// Overload for no params
export function createReactiveMutation<
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveMutation<void, TResult, TError>['use'],
): ReactiveMutation<void, TResult, TError>;

// Overload for optional params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveMutation<TParams | undefined, TResult, TError>['use'],
): ReactiveMutation<TParams | undefined, TResult, TError>;

// Overload for required params
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveMutation<TParams, TResult, TError>['use'],
): ReactiveMutation<TParams, TResult, TError>;

// Implementation
export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveMutation<TParams, TResult, TError>['use'],
): ReactiveMutation<TParams, TResult, TError> {
  return coreCreateReactiveMutation(reactiveFn);
}
