import { createIdiomaticMutation as coreCreateIdiomaticMutation } from '@chimeric/core';
import { IdiomaticMutation } from './types';

export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TError>,
): IdiomaticMutation<
  TParams extends undefined ? void : TParams,
  TResult,
  TError
> {
  return coreCreateIdiomaticMutation(idiomaticFn) as IdiomaticMutation<
    TParams extends undefined ? void : TParams,
    TResult,
    TError
  >;
}
