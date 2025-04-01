import { IdiomaticPromise, createIdiomaticPromise } from '@chimeric/core';

export const IdiomaticPromiseFactory = <TParams = void, TResult = unknown>({
  promiseFn,
}: {
  promiseFn: (args: TParams) => Promise<TResult>;
}): IdiomaticPromise<TParams, TResult> => {
  return createIdiomaticPromise(promiseFn);
};
