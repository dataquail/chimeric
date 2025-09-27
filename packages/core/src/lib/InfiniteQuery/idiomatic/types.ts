export type IdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TIdiomaticNativeOptions = unknown,
> = TParams extends object
  ? Omit<TParams, 'options' | 'nativeOptions'> extends
      | undefined
      | {
          options?: IdiomaticInfiniteQueryOptions<TPageParam>;
          nativeOptions?: TIdiomaticNativeOptions;
        }
    ? (params?: {
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TIdiomaticNativeOptions;
      }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
    : (
        paramsAndConfig: TParams & {
          options?: IdiomaticInfiniteQueryOptions<TPageParam>;
          nativeOptions?: TIdiomaticNativeOptions;
        },
      ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
  : TParams extends void
  ? (params?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>
  : never;

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
> = IdiomaticInfiniteQuery<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  TPageData,
  TPageParam,
  TIdiomaticNativeOptions
>;
