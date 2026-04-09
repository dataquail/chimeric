/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createIdiomaticSync,
  IdiomaticSync,
  isIdiomaticSync,
} from '@chimeric/core';

// Helper type to extract the result type from a service configuration
type ExtractServiceResult<TConfig> = TConfig extends {
  service: IdiomaticSync<infer _TParams, infer TResult>;
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

type AnyServiceConfig = {
  service: IdiomaticSync<any, any>;
  getParams?: (params: any) => any;
};

type InferIdiomaticSync<T extends (args: Parameters<T>[0]) => ReturnType<T>> =
  T;

type InferService<TConfig, TServiceParams> = TConfig extends {
  service: InferIdiomaticSync<infer T>;
}
  ? Parameters<T> extends []
    ? {
        service: IdiomaticSync<void, ReturnType<T>>;
        getParams?: never;
      }
    : undefined extends Parameters<T>[0]
    ? {
        service: IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
        getParams?:
          | ((params: TServiceParams) => Parameters<T>[0])
          | (() => Parameters<T>[0]);
      }
    : {
        service: IdiomaticSync<Parameters<T>[0], ReturnType<T>>;
        getParams:
          | ((params: TServiceParams) => Parameters<T>[0])
          | (() => Parameters<T>[0]);
      }
  : never;

export const IdiomaticSyncReducer = <TServiceParams = void>() => ({
  build: <
    TServiceResult,
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
  >({
    reducer,
    serviceList,
  }: {
    serviceList: TConfigList;
    reducer: (
      args: ExtractResults<TConfigList>,
      serviceParams: TServiceParams,
    ) => TServiceResult;
  }): IdiomaticSync<TServiceParams, TServiceResult> => {
    const service0 = getService(serviceList[0]);
    const service1 = getService(serviceList[1]);
    const service2 = getService(serviceList[2]);
    const service3 = getService(serviceList[3]);
    const service4 = getService(serviceList[4]);
    const service5 = getService(serviceList[5]);
    const service6 = getService(serviceList[6]);
    const service7 = getService(serviceList[7]);
    const service8 = getService(serviceList[8]);
    const service9 = getService(serviceList[9]);

    return createIdiomaticSync<TServiceParams, TServiceResult>((params) => {
      const results = [
        service0(getArgs(serviceList[0], params)),
        service1(getArgs(serviceList[1], params)),
        service2(getArgs(serviceList[2], params)),
        service3(getArgs(serviceList[3], params)),
        service4(getArgs(serviceList[4], params)),
        service5(getArgs(serviceList[5], params)),
        service6(getArgs(serviceList[6], params)),
        service7(getArgs(serviceList[7], params)),
        service8(getArgs(serviceList[8], params)),
        service9(getArgs(serviceList[9], params)),
      ].slice(0, serviceList.length) as ExtractResults<TConfigList>;
      return reducer(results, params);
    });
  },
});

const getService = (
  service: AnyServiceConfig | undefined,
): ((params?: any) => any) => {
  if (!service) {
    return () => undefined;
  } else {
    return service.service || (() => undefined);
  }
};

const getArgs = <TServiceParams>(
  service: AnyServiceConfig | undefined,
  serviceParams: TServiceParams | void,
) => {
  if (!service) {
    return undefined;
  }

  // Get params either from getParams function or undefined for void services
  const params = (service as { getParams: (params: any) => any })?.getParams
    ? (service as { getParams: (params: any) => any }).getParams(serviceParams)
    : undefined;

  if (isIdiomaticSync(service.service)) {
    return params;
  } else {
    throw new Error('Invalid service type');
  }
};
