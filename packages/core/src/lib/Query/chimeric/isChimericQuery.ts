import { ChimericQuery } from './types';
import { isIdiomaticQuery } from '../idiomatic/isIdiomaticQuery';
import { isReactiveQuery } from '../reactive/isReactiveQuery';

export const isChimericQuery = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(
  maybeChimericQuery: ChimericQuery<
    TParams,
    TResult,
    TError,
    TNativeIdiomaticOptions,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >,
): maybeChimericQuery is ChimericQuery<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> => {
  return (
    isIdiomaticQuery(maybeChimericQuery) && isReactiveQuery(maybeChimericQuery)
  );
};
