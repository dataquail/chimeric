export type ReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = TParams extends object
  ? Omit<TParams, 'options' | 'nativeOptions'> extends
      | undefined
      | {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: TNativeOptions;
        }
    ? {
        use: (params?: {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: TNativeOptions;
        }) => ReactiveInfiniteQueryResult<
          TPageData,
          TPageParam,
          TError,
          TNativeReturnType
        >;
      }
    : {
        use: (
          paramsAndConfig: TParams & {
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
  : TParams extends void
  ? {
      use: (params?: {
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveInfiniteQueryResult<
        TPageData,
        TPageParam,
        TError,
        TNativeReturnType
      >;
    }
  : never;

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
> = ReactiveInfiniteQuery<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType
>;
