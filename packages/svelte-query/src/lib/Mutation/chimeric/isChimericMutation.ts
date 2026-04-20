import { isChimericMutation as coreIsChimericMutation } from '@chimeric/core';
import { ChimericMutation } from './types';

export function isChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  mutation: ChimericMutation<TParams, TResult, TError>,
): mutation is ChimericMutation<TParams, TResult, TError> {
  return coreIsChimericMutation(mutation);
}
