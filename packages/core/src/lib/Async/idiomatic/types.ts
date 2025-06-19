export type IdiomaticAsync<TParams, TResult> = TParams extends Record<
  'options',
  unknown
>
  ? never
  : TParams extends undefined
  ? (config?: { options: IdiomaticAsyncOptions }) => Promise<TResult>
  : TParams extends object
  ? (
      paramsAndConfig: TParams & { options?: IdiomaticAsyncOptions },
    ) => Promise<TResult>
  : TParams extends unknown
  ? (config?: { options: IdiomaticAsyncOptions }) => Promise<TResult>
  : never;

export type IdiomaticAsyncOptions = {
  retry?: number;
};

export type DefineIdiomaticAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;
