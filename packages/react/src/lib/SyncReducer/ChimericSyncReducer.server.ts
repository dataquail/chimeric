import {
  ChimericSync,
  fuseChimericSync,
  createReactiveSync,
} from '@chimeric/core';
import { IdiomaticSyncReducer } from './IdiomaticSyncReducer';
import { throwHookServerError } from '../serverErrors';

type ExtractServiceResult<TConfig> = TConfig extends {
  service: ChimericSync<infer _TParams, infer TResult>;
}
  ? TResult
  : never;

type ExtractResults<T extends readonly unknown[]> = {
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

 
export const ChimericSyncReducer = <TServiceParams = void>() => ({
  build: <
    TConfigList extends
      | readonly [InferService<TConfigList[0], TServiceParams>]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
          InferService<TConfigList[8], TServiceParams>,
        ]
      | readonly [
          InferService<TConfigList[0], TServiceParams>,
          InferService<TConfigList[1], TServiceParams>,
          InferService<TConfigList[2], TServiceParams>,
          InferService<TConfigList[3], TServiceParams>,
          InferService<TConfigList[4], TServiceParams>,
          InferService<TConfigList[5], TServiceParams>,
          InferService<TConfigList[6], TServiceParams>,
          InferService<TConfigList[7], TServiceParams>,
          InferService<TConfigList[8], TServiceParams>,
          InferService<TConfigList[9], TServiceParams>,
        ],
    TServiceResult,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        serviceList: serviceList as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reducer: reducer as any,
      }),
      reactive: (() => {
        const stubUseHook = () => throwHookServerError('useHook');
        return createReactiveSync(stubUseHook);
      })(),
    }) as ChimericSync<TServiceParams, TServiceResult>;
  },
});
