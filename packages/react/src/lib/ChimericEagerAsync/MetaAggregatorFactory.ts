/* eslint-disable @typescript-eslint/no-explicit-any */

import { Reactive } from '@chimeric/core';

export const MetaAggregatorFactory = <
  TMeta extends
    | [Reactive<any, any>]
    | [Reactive<any, any>, Reactive<any, any>]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ]
    | [
        Reactive<any, any>,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
        Reactive<any, any> | undefined,
      ],
  Context,
  TData,
>(
  metaList: TMeta,
  dataReducer: (
    dataList:
      | [TMeta[0]['data']]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
          TMeta[5] extends Reactive<any, any> ? TMeta[5]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
          TMeta[5] extends Reactive<any, any> ? TMeta[5]['data'] : never,
          TMeta[6] extends Reactive<any, any> ? TMeta[6]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
          TMeta[5] extends Reactive<any, any> ? TMeta[5]['data'] : never,
          TMeta[6] extends Reactive<any, any> ? TMeta[6]['data'] : never,
          TMeta[7] extends Reactive<any, any> ? TMeta[7]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
          TMeta[5] extends Reactive<any, any> ? TMeta[5]['data'] : never,
          TMeta[6] extends Reactive<any, any> ? TMeta[6]['data'] : never,
          TMeta[7] extends Reactive<any, any> ? TMeta[7]['data'] : never,
          TMeta[8] extends Reactive<any, any> ? TMeta[8]['data'] : never,
        ]
      | [
          TMeta[0]['data'],
          TMeta[1] extends Reactive<any, any> ? TMeta[1]['data'] : never,
          TMeta[2] extends Reactive<any, any> ? TMeta[2]['data'] : never,
          TMeta[3] extends Reactive<any, any> ? TMeta[3]['data'] : never,
          TMeta[4] extends Reactive<any, any> ? TMeta[4]['data'] : never,
          TMeta[5] extends Reactive<any, any> ? TMeta[5]['data'] : never,
          TMeta[6] extends Reactive<any, any> ? TMeta[6]['data'] : never,
          TMeta[7] extends Reactive<any, any> ? TMeta[7]['data'] : never,
          TMeta[8] extends Reactive<any, any> ? TMeta[8]['data'] : never,
          TMeta[9] extends Reactive<any, any> ? TMeta[9]['data'] : never,
        ],
    context?: Context extends void ? undefined : Context,
  ) => TData,
  context?: Context extends void ? undefined : Context,
) => {
  const aggregatedMeta = {
    isIdle: metaList.every((meta) => meta?.isIdle),
    isPending: metaList.some((meta) => meta?.isPending),
    isError: metaList.some((meta) => meta?.isError),
    isSuccess: metaList.every((meta) => meta?.isSuccess),
    error: metaList.find((meta) => meta?.isError)?.error as
      | TMeta[0]['error']
      | (TMeta[1] extends Reactive<any, any> ? TMeta[1]['error'] : never)
      | (TMeta[2] extends Reactive<any, any> ? TMeta[2]['error'] : never)
      | (TMeta[3] extends Reactive<any, any> ? TMeta[3]['error'] : never)
      | (TMeta[4] extends Reactive<any, any> ? TMeta[4]['error'] : never)
      | (TMeta[5] extends Reactive<any, any> ? TMeta[5]['error'] : never)
      | (TMeta[6] extends Reactive<any, any> ? TMeta[6]['error'] : never)
      | (TMeta[7] extends Reactive<any, any> ? TMeta[7]['error'] : never)
      | (TMeta[8] extends Reactive<any, any> ? TMeta[8]['error'] : never)
      | (TMeta[9] extends Reactive<any, any> ? TMeta[9]['error'] : never),
  };

  return {
    isIdle: aggregatedMeta.isIdle,
    isPending: aggregatedMeta.isPending,
    isError: aggregatedMeta.isError,
    isSuccess: aggregatedMeta.isSuccess,
    error: aggregatedMeta.error,
    data: dataReducer(
      [
        metaList[0]?.data,
        metaList[1]?.data,
        metaList[2]?.data,
        metaList[3]?.data,
        metaList[4]?.data,
        metaList[5]?.data,
        metaList[6]?.data,
        metaList[7]?.data,
        metaList[8]?.data,
        metaList[9]?.data,
      ],
      context,
    ),
  };
};
