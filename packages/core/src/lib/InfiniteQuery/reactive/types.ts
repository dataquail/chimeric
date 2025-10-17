export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = [TParams] extends [void]
  ? {
      use: (allOptions?: {
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
    }
  : [TParams] extends [undefined]
  ? {
      use: (allOptions?: {
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
    }
  : undefined extends TParams
  ? {
      use: (
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
    }
  : {
      use: (
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
> = Parameters<T> extends []
  ? ReactiveInfiniteQuery<
      void,
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType
    >
  : ReactiveInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType
    >;
