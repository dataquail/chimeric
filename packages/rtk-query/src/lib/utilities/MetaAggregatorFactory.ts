/* eslint-disable @typescript-eslint/no-explicit-any */

import { Reactive } from '@chimeric/core';

type InferResult<TResult> = TResult extends Reactive<infer TData, infer TError>
  ? Reactive<TData, TError>
  : TResult;

type InferResultData<TResult> = TResult extends Reactive<infer TData, any>
  ? TData
  : TResult;

type InferResultError<TResult> = TResult extends Reactive<any, infer TError>
  ? TError
  : TResult;

type ExtractResults<T extends readonly any[]> = T extends readonly [infer C0]
  ? [InferResult<C0>]
  : T extends readonly [infer C0, infer C1]
  ? [InferResult<C0>, InferResult<C1>]
  : T extends readonly [infer C0, infer C1, infer C2]
  ? [InferResult<C0>, InferResult<C1>, InferResult<C2>]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3]
  ? [InferResult<C0>, InferResult<C1>, InferResult<C2>, InferResult<C3>]
  : T extends readonly [infer C0, infer C1, infer C2, infer C3, infer C4]
  ? [
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
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
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
      InferResult<C5>,
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
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
      InferResult<C5>,
      InferResult<C6>,
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
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
      InferResult<C5>,
      InferResult<C6>,
      InferResult<C7>,
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
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
      InferResult<C5>,
      InferResult<C6>,
      InferResult<C7>,
      InferResult<C8>,
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
      InferResult<C0>,
      InferResult<C1>,
      InferResult<C2>,
      InferResult<C3>,
      InferResult<C4>,
      InferResult<C5>,
      InferResult<C6>,
      InferResult<C7>,
      InferResult<C8>,
      InferResult<C9>,
    ]
  : never;

export type ExtractTResultExtends<TResultList extends readonly any[]> =
  | [InferResult<TResultList[0]>]
  | [InferResult<TResultList[0]>, InferResult<TResultList[1]>]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
      InferResult<TResultList[5]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
      InferResult<TResultList[5]> | undefined,
      InferResult<TResultList[6]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
      InferResult<TResultList[5]> | undefined,
      InferResult<TResultList[6]> | undefined,
      InferResult<TResultList[7]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
      InferResult<TResultList[5]> | undefined,
      InferResult<TResultList[6]> | undefined,
      InferResult<TResultList[7]> | undefined,
      InferResult<TResultList[8]> | undefined,
    ]
  | [
      InferResult<TResultList[0]>,
      InferResult<TResultList[1]> | undefined,
      InferResult<TResultList[2]> | undefined,
      InferResult<TResultList[3]> | undefined,
      InferResult<TResultList[4]> | undefined,
      InferResult<TResultList[5]> | undefined,
      InferResult<TResultList[6]> | undefined,
      InferResult<TResultList[7]> | undefined,
      InferResult<TResultList[8]> | undefined,
      InferResult<TResultList[9]> | undefined,
    ];

type ExtractDataList<TResultList extends ExtractTResultExtends<TResultList>> =
  | [InferResultData<TResultList[0]>]
  | [InferResultData<TResultList[0]>, InferResultData<TResultList[1]>]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
      InferResultData<TResultList[5]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
      InferResultData<TResultList[5]>,
      InferResultData<TResultList[6]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
      InferResultData<TResultList[5]>,
      InferResultData<TResultList[6]>,
      InferResultData<TResultList[7]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
      InferResultData<TResultList[5]>,
      InferResultData<TResultList[6]>,
      InferResultData<TResultList[7]>,
      InferResultData<TResultList[8]>,
    ]
  | [
      InferResultData<TResultList[0]>,
      InferResultData<TResultList[1]>,
      InferResultData<TResultList[2]>,
      InferResultData<TResultList[3]>,
      InferResultData<TResultList[4]>,
      InferResultData<TResultList[5]>,
      InferResultData<TResultList[6]>,
      InferResultData<TResultList[7]>,
      InferResultData<TResultList[8]>,
      InferResultData<TResultList[9]>,
    ];

export const MetaAggregatorFactory = <
  TResultList extends ExtractTResultExtends<TResultList>,
  TData,
  TContext,
>({
  metaList,
  dataReducer,
  initialValueReducer,
  context,
}: {
  metaList: TResultList;
  dataReducer: (
    dataList: ExtractDataList<TResultList>,
    context: TContext,
  ) => TData;
  context?: TContext;
  initialValueReducer?: (
    args: ExtractResults<TResultList>,
    context: TContext,
  ) => TData;
}) => {
  const aggregatedMeta = {
    isIdle: metaList
      .filter((meta) => (meta as any)?.isIdle !== undefined)
      .every((meta) => (meta as Reactive<any, any>).isIdle),
    isPending: metaList
      .filter((meta) => (meta as any)?.isPending !== undefined)
      .some((meta) => (meta as Reactive<any, any>).isPending),
    isError: metaList
      .filter((meta) => (meta as any)?.isError !== undefined)
      .some((meta) => (meta as Reactive<any, any>).isError),
    isSuccess: metaList
      .filter((meta) => (meta as any)?.isSuccess !== undefined)
      .every((meta) => (meta as Reactive<any, any>).isSuccess),
    error: metaList
      .filter((meta) => (meta as any)?.isError !== undefined)
      .map((meta) => (meta as Reactive<any, any>).error)
      .find((error) => error !== undefined) as
      | InferResultError<TResultList[0]>
      | InferResultError<TResultList[1]>
      | InferResultError<TResultList[2]>
      | InferResultError<TResultList[3]>
      | InferResultError<TResultList[4]>
      | InferResultError<TResultList[5]>
      | InferResultError<TResultList[6]>
      | InferResultError<TResultList[7]>
      | InferResultError<TResultList[8]>
      | InferResultError<TResultList[9]>,
  };

  return {
    isIdle: aggregatedMeta.isIdle,
    isPending: aggregatedMeta.isPending,
    isError: aggregatedMeta.isError,
    isSuccess: aggregatedMeta.isSuccess,
    error: aggregatedMeta.error,
    data:
      initialValueReducer && aggregatedMeta.isPending
        ? initialValueReducer(
            [
              isReactive(metaList[0]) ? (metaList[0] as any).data : metaList[0],
              isReactive(metaList[1]) ? (metaList[1] as any).data : metaList[1],
              isReactive(metaList[2]) ? (metaList[2] as any).data : metaList[2],
              isReactive(metaList[3]) ? (metaList[3] as any).data : metaList[3],
              isReactive(metaList[4]) ? (metaList[4] as any).data : metaList[4],
              isReactive(metaList[5]) ? (metaList[5] as any).data : metaList[5],
              isReactive(metaList[6]) ? (metaList[6] as any).data : metaList[6],
              isReactive(metaList[7]) ? (metaList[7] as any).data : metaList[7],
              isReactive(metaList[8]) ? (metaList[8] as any).data : metaList[8],
              isReactive(metaList[9]) ? (metaList[9] as any).data : metaList[9],
            ].slice(0, metaList.length) as any,
            context ?? ({} as TContext),
          )
        : aggregatedMeta.isPending
        ? undefined
        : dataReducer(
            [
              isReactive(metaList[0]) ? (metaList[0] as any).data : metaList[0],
              isReactive(metaList[1]) ? (metaList[1] as any).data : metaList[1],
              isReactive(metaList[2]) ? (metaList[2] as any).data : metaList[2],
              isReactive(metaList[3]) ? (metaList[3] as any).data : metaList[3],
              isReactive(metaList[4]) ? (metaList[4] as any).data : metaList[4],
              isReactive(metaList[5]) ? (metaList[5] as any).data : metaList[5],
              isReactive(metaList[6]) ? (metaList[6] as any).data : metaList[6],
              isReactive(metaList[7]) ? (metaList[7] as any).data : metaList[7],
              isReactive(metaList[8]) ? (metaList[8] as any).data : metaList[8],
              isReactive(metaList[9]) ? (metaList[9] as any).data : metaList[9],
            ].slice(0, metaList.length) as any,
            context ?? ({} as TContext),
          ),
  };
};

const isReactive = <TResult = unknown>(meta: TResult) => {
  return (
    (meta as any)?.isIdle !== undefined &&
    (meta as any)?.isPending !== undefined &&
    (meta as any)?.isError !== undefined &&
    (meta as any)?.isSuccess !== undefined
  );
};
