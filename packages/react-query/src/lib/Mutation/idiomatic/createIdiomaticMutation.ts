import { createIdiomaticMutation as coreCreateIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutation } from './types';

// Overload for no params
export function createIdiomaticMutation<
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: IdiomaticMutation<void, TResult, TError>,
): IdiomaticMutation<void, TResult, TError>;

// Overload for optional params
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: IdiomaticMutation<TParams | undefined, TResult, TError>,
): IdiomaticMutation<TParams | undefined, TResult, TError>;

// Overload for required params
export function createIdiomaticMutation<
  TParams,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TError>,
): IdiomaticMutation<TParams, TResult, TError>;

// Implementation
export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TError>,
): IdiomaticMutation<TParams, TResult, TError> {
  return coreCreateIdiomaticMutation(idiomaticFn) as IdiomaticMutation<
    TParams,
    TResult,
    TError
  >;
}
