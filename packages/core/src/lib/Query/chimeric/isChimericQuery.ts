import { ChimericQuery } from './types';
import { isIdiomaticQuery } from '../idiomatic/isIdiomaticQuery';
import { isReactiveQuery } from '../reactive/isReactiveQuery';

export const isChimericQuery = <
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(
  maybeChimericQuery: unknown,
): maybeChimericQuery is ChimericQuery<
  TParams,
  TResult,
  E,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> => {
  return (
    isIdiomaticQuery(maybeChimericQuery) && isReactiveQuery(maybeChimericQuery)
  );
};
