import { ReactiveQuery, ReactiveQueryOptions } from './types';
import { isReactiveQuery } from './isReactiveQuery';

// Overloads
export function createReactiveQuery<
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (params?: {
    options?: ReactiveQueryOptions;
    nativeOptions?: TNativeOptions;
  }) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    refetch: () => Promise<TResult>;
    native: TNativeReturnType;
  },
): ReactiveQuery<undefined, TResult, E, TNativeOptions, TNativeReturnType>;
export function createReactiveQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (
    params: TParams & {
      options?: ReactiveQueryOptions;
      nativeOptions?: TNativeOptions;
    },
  ) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    refetch: () => Promise<TResult>;
    native: TNativeReturnType;
  },
): ReactiveQuery<TParams, TResult, E, TNativeOptions, TNativeReturnType>;

// Implementation
export function createReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveQuery<
    TParams,
    TResult,
    E,
    TNativeOptions,
    TNativeReturnType
  >['useQuery'],
): ReactiveQuery<TParams, TResult, E, TNativeOptions, TNativeReturnType> {
  const reactiveQuery = {
    useQuery: reactiveFn,
  };
  if (
    isReactiveQuery<TParams, TResult, E, TNativeOptions, TNativeReturnType>(
      reactiveQuery,
    )
  ) {
    return reactiveQuery;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
