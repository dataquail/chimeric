import {
  IdiomaticQuery as CoreIdiomaticQuery,
  DefineIdiomaticQuery as CoreDefineIdiomaticQuery,
} from '@chimeric/core';
import type { StartQueryActionCreatorOptions } from '@reduxjs/toolkit/query';

export type RtkQueryIdiomaticNativeOptions = StartQueryActionCreatorOptions;

export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
> = CoreIdiomaticQuery<
  TParams,
  TResult,
  RtkQueryIdiomaticNativeOptions
>;

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = CoreDefineIdiomaticQuery<
  T,
  RtkQueryIdiomaticNativeOptions
>;
