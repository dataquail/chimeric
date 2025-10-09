import { isChimericQuery as coreIsChimericQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';
import { ChimericQuery } from './types';

export const isChimericQuery = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  maybeChimericQuery: ChimericQuery<TParams, TResult, TError, TQueryKey>,
): maybeChimericQuery is ChimericQuery<TParams, TResult, TError, TQueryKey> => {
  return coreIsChimericQuery(maybeChimericQuery);
};
