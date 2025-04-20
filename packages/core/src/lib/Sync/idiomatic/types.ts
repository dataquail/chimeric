export type IdiomaticSync<TParams, TResult> = TParams extends undefined
  ? () => TResult
  : (params: TParams) => TResult;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
