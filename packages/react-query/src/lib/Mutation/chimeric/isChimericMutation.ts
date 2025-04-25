import { isChimericMutation as coreIsChimericMutation } from '@chimeric/core';
import { ChimericMutation } from './types';

export const isChimericMutation = <
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericMutation: unknown,
): maybeChimericMutation is ChimericMutation<TParams, TResult, E> => {
  return coreIsChimericMutation(maybeChimericMutation);
};
