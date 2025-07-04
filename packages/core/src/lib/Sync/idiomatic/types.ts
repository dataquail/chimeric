export type IdiomaticSync<TParams = void, TResult = unknown> = TParams extends
  | void
  | undefined
  ? () => TResult
  : (params: TParams) => TResult;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
