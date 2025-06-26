import { fuseChimericMutation as coreFuseChimericMutation } from '@chimeric/core';
import { IdiomaticMutation } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';
import { ChimericMutation } from './types';

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
