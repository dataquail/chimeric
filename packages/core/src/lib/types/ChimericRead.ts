import { IdiomaticFunction } from './IdiomaticFunction.js';
import {
  ExtractChimericParameter,
  ExtractChimericReturnType,
} from './UtilityTypes.js';

export type ChimericRead<TParams, TResult> = IdiomaticFunction<
  TParams,
  TResult
> & {
  use: (params: TParams) => TResult;
};

export type DefineChimericRead<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ChimericRead<ExtractChimericParameter<T>, ExtractChimericReturnType<T>>;
