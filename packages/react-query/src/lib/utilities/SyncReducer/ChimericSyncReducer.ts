/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChimericSync, fuseChimericSync } from '@chimeric/core';
import { IdiomaticSyncReducer } from './IdiomaticSyncReducer';
import { ReactiveSyncReducer } from './ReactiveSyncReducer';

// Helper type to extract the result type from a service configuration
type ExtractServiceResult<TConfig> = TConfig extends {
  service: ChimericSync<infer TParams, infer TResult>;
}
  ? TResult
  : never;

// Type to extract results from a tuple of configs
type ExtractResults<T extends readonly any[]> = T extends readonly [infer C0]
  ? [ExtractServiceResult<C0>]
  : T extends readonly [infer C0, infer C1]
  ? [ExtractServiceResult<C0>, ExtractServiceResult<C1>]
  : T extends readonly [infer C0, infer C1, infer C2]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
    ]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
    ]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3, infer C4]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
      infer C8,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
      ExtractServiceResult<C8>,
    ]
  : T extends readonly [
      infer C0,
      infer C1,
      infer C2,
      infer C3,
      infer C4,
      infer C5,
      infer C6,
      infer C7,
      infer C8,
      infer C9,
    ]
  ? [
      ExtractServiceResult<C0>,
      ExtractServiceResult<C1>,
      ExtractServiceResult<C2>,
      ExtractServiceResult<C3>,
      ExtractServiceResult<C4>,
      ExtractServiceResult<C5>,
      ExtractServiceResult<C6>,
      ExtractServiceResult<C7>,
      ExtractServiceResult<C8>,
      ExtractServiceResult<C9>,
    ]
  : never;

type InferService<TConfig, TServiceParams> = TConfig extends {
  service: ChimericSync<infer TParams, infer TResult>;
}
  ? [TParams] extends [void]
    ? {
        service: ChimericSync<void, TResult>;
        getParams?: never;
      }
    : void extends TParams
    ? {
        service: ChimericSync<void, TResult>;
        getParams?: never;
      }
    : undefined extends TParams
    ? {
        service: ChimericSync<TParams, TResult>;
        getParams: (params?: TServiceParams) => TParams;
      }
    : undefined extends TServiceParams
    ? {
        service: ChimericSync<TParams, TResult>;
        getParams?: (params: TServiceParams) => TParams;
      }
    : {
        service: ChimericSync<TParams, TResult>;
        getParams: (params: TServiceParams) => TParams;
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
        serviceList: serviceList as any, // TypeScript limitation workaround
        reducer: reducer as any, // TypeScript limitation workaround
      }),
      reactive: ReactiveSyncReducer<TServiceParams>().build({
        serviceList: serviceList as any, // TypeScript limitation workaround
        reducer: reducer as any, // TypeScript limitation workaround
      }),
    });
  },
});
