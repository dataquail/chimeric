import { ChimericInfiniteQuery } from './types';
import { isIdiomaticInfiniteQuery } from '../idiomatic/isIdiomaticInfiniteQuery';
import { isReactiveInfiniteQuery } from '../reactive/isReactiveInfiniteQuery';

export const isChimericInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(
  maybeChimericInfiniteQuery: unknown,
): maybeChimericInfiniteQuery is ChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> => {
  return (
    isIdiomaticInfiniteQuery(maybeChimericInfiniteQuery) &&
    isReactiveInfiniteQuery(maybeChimericInfiniteQuery)
  );
};