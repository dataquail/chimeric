import { ChimericAsync, fuseChimericAsync } from '@chimeric/core';
import { IdiomaticAsyncFactory } from './IdiomaticAsyncFactory';
import { ReactiveAsyncFactory } from './ReactiveAsyncFactory';

export const ChimericAsyncFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  asyncFn: TParams extends Record<'options', any>
    ? never
    : TParams extends void
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>,
): ChimericAsync<
  Parameters<typeof asyncFn>[0],
  Awaited<ReturnType<typeof asyncFn>>,
  E
> => {
  return fuseChimericAsync({
    idiomatic: IdiomaticAsyncFactory(asyncFn),
    reactive: ReactiveAsyncFactory(asyncFn),
  });
};
