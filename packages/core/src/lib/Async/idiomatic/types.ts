export type IdiomaticAsync<
  TParams = void,
  TResult = unknown,
> = TParams extends object
  ? Omit<TParams, 'options'> extends
      | undefined
      | {
          options?: IdiomaticAsyncOptions;
        }
    ? (config?: { options?: IdiomaticAsyncOptions }) => Promise<TResult>
    : (
        paramsAndConfig: TParams & { options?: IdiomaticAsyncOptions },
      ) => Promise<TResult>
  : TParams extends void
  ? (config?: { options?: IdiomaticAsyncOptions } | TParams) => Promise<TResult>
  : never;

export type IdiomaticAsyncOptions = {
  retry?: number;
};

export type DefineIdiomaticAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsync<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;
