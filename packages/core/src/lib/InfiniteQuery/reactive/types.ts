export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
> = [TParams] extends [void]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: TNativePrefetchOptions;
      }) => void;
    }
  : [TParams] extends [undefined]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: TNativePrefetchOptions;
      }) => void;
    }
  : undefined extends TParams
  ? {
      useHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: TNativeOptions;
        },
      ) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
      usePrefetchHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          nativeOptions?: TNativePrefetchOptions;
        },
      ) => void;
    }
  : {
      useHook: (
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
      >;
      usePrefetchHook: (
        params: TParams,
        allOptions?: {
          nativeOptions?: TNativePrefetchOptions;
        },
      ) => void;
    };

export type ReactiveInfiniteQueryOptions = {
  enabled?: boolean;
};

export type ReactiveInfiniteQueryResult<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeReturnType = unknown,
> = {
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TError | null;
  data:
    | {
        pages: TPageData[];
        pageParams: TPageParam[];
      }
    | undefined;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => Promise<
    InfiniteQueryObserverResult<TPageData, TPageParam>
  >;
  fetchPreviousPage: () => Promise<
    InfiniteQueryObserverResult<TPageData, TPageParam>
  >;
  refetch: () => Promise<InfiniteQueryObserverResult<TPageData, TPageParam>>;
  native: TNativeReturnType;
};

export type InfiniteQueryObserverResult<
  TPageData = unknown,
  TPageParam = unknown,
> = {
  pages: TPageData[];
  pageParams: TPageParam[];
};

export type DefineReactiveInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
> = Parameters<T> extends []
  ? ReactiveInfiniteQuery<
      void,
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType,
      TNativePrefetchOptions
    >
  : ReactiveInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType,
      TNativePrefetchOptions
    >;
