import { ChimericQuery } from './types';
import { isIdiomaticQuery } from '../idiomatic/isIdiomaticQuery';
import { isReactiveQuery } from '../reactive/isReactiveQuery';

export const isChimericQuery = <
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericQuery: unknown,
): maybeChimericQuery is ChimericQuery<TParams, TResult, E> => {
  return (
    isIdiomaticQuery(maybeChimericQuery) && isReactiveQuery(maybeChimericQuery)
  );
};
