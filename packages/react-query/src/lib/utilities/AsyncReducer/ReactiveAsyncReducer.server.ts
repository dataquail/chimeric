import { createReactiveEagerAsync, ReactiveEagerAsync } from '@chimeric/core';
import { throwHookServerError } from '../../serverErrors';

export const ReactiveAsyncReducer = <TServiceParams = void>() => ({
  build: <TServiceResult>(): ReactiveEagerAsync<
    TServiceParams,
    TServiceResult
  > => {
    const stubUseHook = () => throwHookServerError('useHook');
    return createReactiveEagerAsync(stubUseHook) as unknown as ReactiveEagerAsync<
      TServiceParams,
      TServiceResult
    >;
  },
});
