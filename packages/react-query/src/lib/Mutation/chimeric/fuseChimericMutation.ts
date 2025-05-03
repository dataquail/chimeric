import { fuseChimericMutation as coreFuseChimericMutation } from '@chimeric/core';
import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { ChimericMutation } from './types';

// Overloads
export function fuseChimericMutation<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<undefined, TResult, E>;
  reactive: ReactiveMutation<undefined, TResult, E>;
}): ChimericMutation<undefined, TResult, E>;
export function fuseChimericMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, E>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E>;

// Implementation
export function fuseChimericMutation<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  idiomatic: IdiomaticMutation<TParams, TResult, E>;
  reactive: ReactiveMutation<TParams, TResult, E>;
}): ChimericMutation<TParams, TResult, E> {
  return coreFuseChimericMutation(args) as ChimericMutation<
    TParams,
    TResult,
    E
  >;
}
