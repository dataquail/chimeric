import { isChimericMutation as coreIsChimericMutation } from '@chimeric/core';
import { ChimericMutation } from './types';

export const isChimericMutation = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeChimericMutation: unknown,
): maybeChimericMutation is ChimericMutation<TParams, TResult, TError> => {
  return coreIsChimericMutation(maybeChimericMutation);
};
