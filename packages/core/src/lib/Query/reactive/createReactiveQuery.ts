import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import {
  ReactiveQuery,
  ReactiveQueryReturn,
  ReactiveQueryOptions,
} from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

// No params
export function createReactiveQuery<
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveQueryOptions;
    nativeOptions?: TNativeOptions;
  }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
  usePrefetchHookFn: (allOptions?: {
    nativeOptions?: TNativePrefetchOptions;
  }) => void,
): ReactiveQuery<
  void,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Optional params
export function createReactiveQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
  usePrefetchHookFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TNativePrefetchOptions;
    },
  ) => void,
): ReactiveQuery<
  TParams | undefined,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Required params
export function createReactiveQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
  usePrefetchHookFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TNativePrefetchOptions;
    },
  ) => void,
): ReactiveQuery<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
>;

// Implementation
export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  reactiveFn: any,
  usePrefetchHookFn: any,
): ReactiveQuery<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
> {
  const reactiveQuery = {
    useHook: reactiveFn,
    usePrefetchHook: usePrefetchHookFn,
  };
  if (isEligibleReactive(reactiveQuery)) {
    return markReactive(reactiveQuery, TYPE_MARKERS.REACTIVE_QUERY);
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
