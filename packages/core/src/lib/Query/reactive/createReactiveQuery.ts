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
>(
  reactiveFn: (allOptions?: {
    options?: ReactiveQueryOptions;
    nativeOptions?: TNativeOptions;
  }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
): ReactiveQuery<void, TResult, TError, TNativeOptions, TNativeReturnType>;

// Optional params
export function createReactiveQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (
    params?: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
): ReactiveQuery<
  TParams | undefined,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType
>;

// Required params
export function createReactiveQuery<
  TParams,
  TResult,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (
    params: TParams,
    allOptions?: {
      options?: ReactiveQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>,
): ReactiveQuery<TParams, TResult, TError, TNativeOptions, TNativeReturnType>;

// Implementation
export function createReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: any,
): ReactiveQuery<TParams, TResult, TError, TNativeOptions, TNativeReturnType> {
  const reactiveQuery = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveQuery)) {
    return markReactive(reactiveQuery, TYPE_MARKERS.REACTIVE_QUERY) as any;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
