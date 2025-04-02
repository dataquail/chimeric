import { ChimericPromise, fuseChimericPromise } from '@chimeric/core';
import { IdiomaticPromiseFactory } from './IdiomaticPromiseFactory';
import { ReactivePromiseFactory } from './ReactivePromiseFactory';

export const ChimericPromiseFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  promiseFn,
}: {
  promiseFn: (args: TParams) => Promise<TResult>;
}): ChimericPromise<TParams, TResult, E> => {
  return fuseChimericPromise({
    idiomatic: IdiomaticPromiseFactory({ promiseFn }),
    reactive: ReactivePromiseFactory<TParams, TResult, E>({ promiseFn })
      .usePromise,
  });
};
