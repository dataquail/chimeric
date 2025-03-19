import { ExtractChimericParameter, ExtractChimericReturnType } from './utils';

export type ChimericRead<TParams, TResult> = {
  call: (args: TParams) => TResult;
  use: (args: TParams) => TResult;
};

export type ChimericReadFactory<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ChimericRead<ExtractChimericParameter<T>, ExtractChimericReturnType<T>>;
