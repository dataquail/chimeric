// export type ReactiveSync<TParams = void, TResult = unknown> = TParams extends
//   | void
//   | undefined
//   ? {
//       useSync: () => TResult;
//     }
//   : {
//       useSync: (params: TParams) => TResult;
//     };

export type ReactiveSync<TParams = void, TResult = unknown> = {
  useSync: TParams extends void | undefined
    ? () => TResult
    : (params: TParams) => TResult;
};

export type DefineReactiveSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ReactiveSync<Parameters<T>[0], ReturnType<T>>;
