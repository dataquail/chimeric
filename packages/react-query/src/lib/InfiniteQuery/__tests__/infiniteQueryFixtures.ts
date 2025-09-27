import { DefineChimericInfiniteQuery } from '../chimeric/types';

export type ChimericInfiniteQueryWithoutParams = DefineChimericInfiniteQuery<
  () => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;

export type ChimericInfiniteQueryWithParams = DefineChimericInfiniteQuery<
  (args: { search: string }) => Promise<{
    pages: Array<{ items: Array<{ id: number; name: string }> }>;
    pageParams: number[];
  }>,
  { items: Array<{ id: number; name: string }> },
  number
>;