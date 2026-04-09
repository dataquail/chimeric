import { createReactiveSync, ReactiveSync } from '@chimeric/core';
import { throwHookServerError } from '../serverErrors';

export const ReactiveSyncReducer = <TServiceParams = void>() => ({
  build: <TServiceResult>(): ReactiveSync<TServiceParams, TServiceResult> => {
    const stubUseHook = () => throwHookServerError('useHook');
    return createReactiveSync(stubUseHook) as ReactiveSync<
      TServiceParams,
      TServiceResult
    >;
  },
});
