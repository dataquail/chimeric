import {
  ChimericSync,
  fuseChimericSync,
  createReactiveSync,
} from '@chimeric/core';
import { IdiomaticSyncReducer } from './IdiomaticSyncReducer';
import { throwHookServerError } from '../../serverErrors';

type ExtractServiceResult<TConfig> = TConfig extends {
  service: ChimericSync<infer _TParams, infer TResult>;
}
  ? TResult
  : never;

type ExtractResults<T extends readonly any[]> = {
  [K in keyof T]: ExtractServiceResult<T[K]>;
};

type InferService<TConfig, TServiceParams> = TConfig extends {
  service: ChimericSync<infer TParams, infer TResult>;
}
  ? {
      service: ChimericSync<TParams, TResult>;
      getParams?: ((params: TServiceParams) => TParams) | (() => TParams);
    }
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ChimericSyncReducer = <TServiceParams = void>() => ({
  build: <
    TServiceResult,
    TConfigList extends readonly InferService<TConfigList[number], TServiceParams>[],
  >({
    reducer,
    serviceList,
  }: {
    serviceList: TConfigList;
    reducer: (
      args: ExtractResults<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
  }): ChimericSync<TServiceParams, TServiceResult> => {
    return fuseChimericSync({
      idiomatic: IdiomaticSyncReducer<TServiceParams>().build({
        serviceList: serviceList as any,
        reducer: reducer as any,
      }),
      reactive: (() => {
        const stubUseHook = () => throwHookServerError('useHook');
        return createReactiveSync(stubUseHook);
      })(),
    }) as ChimericSync<TServiceParams, TServiceResult>;
  },
});
