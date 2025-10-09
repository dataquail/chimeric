export type IdiomaticSync<TParams = void, TResult = unknown> = [
  TParams,
] extends [void]
  ? () => TResult
  : void extends TParams
  ? () => TResult
  : undefined extends TParams
  ? (params?: TParams) => TResult
  : (params: TParams) => TResult;

export type DefineIdiomaticSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = Parameters<T> extends []
  ? IdiomaticSync<void, ReturnType<T>>
  : IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
