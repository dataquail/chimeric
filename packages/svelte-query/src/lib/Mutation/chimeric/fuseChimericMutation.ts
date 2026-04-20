import { fuseChimericMutation as coreFuseChimericMutation } from '@chimeric/core';
import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { ChimericMutation } from './types';

// Overload for no params
export function fuseChimericMutation<
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<void, TResult, TError>;
  reactive: ReactiveMutation<void, TResult, TError>;
}): ChimericMutation<void, TResult, TError>;

// Overload for optional params
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams | undefined, TResult, TError>;
  reactive: ReactiveMutation<TParams | undefined, TResult, TError>;
}): ChimericMutation<TParams | undefined, TResult, TError>;

// Overload for required params
export function fuseChimericMutation<
  TParams,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TError>;
  reactive: ReactiveMutation<TParams, TResult, TError>;
}): ChimericMutation<TParams, TResult, TError>;

// Implementation
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, TError>;
  reactive: ReactiveMutation<TParams, TResult, TError>;
}): ChimericMutation<TParams, TResult, TError> {
  return coreFuseChimericMutation(args);
}
