export type IdiomaticInfiniteQueryPrefetch<
  TParams = void,
  TIdiomaticNativeOptions = unknown,
> = [TParams] extends [void]
  ? (allOptions?: {
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<void>
  : [TParams] extends [undefined]
  ? (allOptions?: {
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<void>
  : undefined extends TParams
  ? (
      params?: NonNullable<TParams>,
      allOptions?: {
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<void>
  : (
      params: TParams,
      allOptions?: {
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<void>;

export type IdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TIdiomaticNativeOptions = unknown,
> = ([TParams] extends [void]
  ? (allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
  : [TParams] extends [undefined]
  ? (allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
  : undefined extends TParams
  ? (
      params?: NonNullable<TParams>,
      allOptions?: {
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
  : (
      params: TParams,
      allOptions?: {
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>) & {
  prefetch: IdiomaticInfiniteQueryPrefetch<
    TParams,
    TIdiomaticNativeOptions
  >;
};

export type IdiomaticInfiniteQueryOptions<TPageParam = unknown> = {
  forceRefetch?: boolean;
  pageParam?: TPageParam;
};

export type IdiomaticInfiniteQueryResult<
  TPageData = unknown,
  TPageParam = unknown,
> = {
  pages: TPageData[];
  pageParams: TPageParam[];
};

export type DefineIdiomaticInfiniteQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TPageData = unknown,
  TPageParam = unknown,
  TIdiomaticNativeOptions = unknown,
> = Parameters<T> extends []
  ? IdiomaticInfiniteQuery<void, TPageData, TPageParam, TIdiomaticNativeOptions>
  : IdiomaticInfiniteQuery<
      Parameters<T>[0],
      TPageData,
      TPageParam,
      TIdiomaticNativeOptions
    >;
