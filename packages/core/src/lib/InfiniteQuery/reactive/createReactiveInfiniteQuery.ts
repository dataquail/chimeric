import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import {
  ReactiveInfiniteQuery,
  ReactiveInfiniteQueryResult,
  ReactiveInfiniteQueryOptions,
} from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

// No params
export function createReactiveInfiniteQuery<
  TPageData,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveInfiniteQueryOptions;
    nativeOptions?: TNativeOptions;
  }) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    TNativeReturnType
  >,
  usePrefetchHookFn: (allOptions?: {
    nativeOptions?: TNativePrefetchOptions;
  }) => void,
): ReactiveInfiniteQuery<
  void,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Optional params
export function createReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveInfiniteQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    TNativeReturnType
  >,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TNativePrefetchOptions;
    },
  ) => void,
): ReactiveInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Required params
export function createReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveInfiniteQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveInfiniteQueryResult<
    TPageData,
    TPageParam,
    TError,
    TNativeReturnType
  >,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TNativePrefetchOptions;
    },
  ) => void,
): ReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Implementation
export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: any,
  usePrefetchHookFn: any,
): ReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
> {
  const reactiveInfiniteQuery = {
    useHook: reactiveFn,
    usePrefetchHook: usePrefetchHookFn,
  };
  if (isEligibleReactive(reactiveInfiniteQuery)) {
    return markReactive(
      reactiveInfiniteQuery,
      TYPE_MARKERS.REACTIVE_INFINITE_QUERY,
    ) as ReactiveInfiniteQuery<
      TParams,
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType,
      TNativePrefetchOptions
    >;
  } else {
    throw new Error(
      'reactiveFn is not qualified to be reactive infinite query',
    );
  }
}
