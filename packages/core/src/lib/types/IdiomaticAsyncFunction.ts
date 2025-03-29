export type IdiomaticAsyncFunction<TParams, TResult> = (
  params: TParams,
) => Promise<TResult>;
