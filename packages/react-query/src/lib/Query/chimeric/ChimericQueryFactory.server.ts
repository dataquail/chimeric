import {
  queryOptions,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { createReactiveQuery } from '../reactive/createReactiveQuery';
import { fuseChimericQuery } from './fuseChimericQuery';
import { type ChimericQuery } from './types';
import { throwHookServerError } from '../../serverErrors';

// Required params
export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey>;

// Optional params
export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): ChimericQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params
export function ChimericQueryFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, TError, TResult, TQueryKey>
  >;
}): ChimericQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQueryOptions: any;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  const idiomatic = IdiomaticQueryFactory({ queryClient, getQueryOptions });
  const stubUseHook = () => throwHookServerError('useHook');
  const stubPrefetchHook = () => throwHookServerError('usePrefetchHook');
  const reactive = createReactiveQuery(stubUseHook, stubPrefetchHook);
  const chimeric = fuseChimericQuery({ idiomatic, reactive });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (chimeric as any).useSuspenseHook = () =>
    throwHookServerError('useSuspenseHook');
  return chimeric as ChimericQuery<TParams, TResult, TError, TQueryKey>;
}
