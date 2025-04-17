export type IdiomaticSync<TParams, TResult> = TParams extends void
  ? () => TResult
  : TParams extends object
  ? (params: TParams) => TResult
  : never;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticSync<Parameters<T>[0], Awaited<ReturnType<T>>>;
