import { isChimericQuery as coreIsChimericQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';
import { ChimericQuery } from './types';

export const isChimericQuery = <
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  maybeChimericQuery: unknown,
): maybeChimericQuery is ChimericQuery<TParams, TResult, E, TQueryKey> => {
  return coreIsChimericQuery(maybeChimericQuery);
};
