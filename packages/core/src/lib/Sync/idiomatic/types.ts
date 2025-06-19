export type IdiomaticSync<TParams, TResult> = TParams extends undefined
  ? () => TResult
  : TParams extends object
  ? (params: TParams) => TResult
  : TParams extends unknown
  ? () => TResult
  : never;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
