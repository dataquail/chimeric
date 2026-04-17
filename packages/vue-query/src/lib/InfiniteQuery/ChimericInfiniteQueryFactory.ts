import { type QueryClient, useInfiniteQuery } from '@tanstack/vue-query';
import { computed, type ComputedRef } from 'vue';

export type VueInfiniteQueryGetOptions<TPageData, TPageParam> = {
  queryKey: unknown[];
  queryFn: (context: { pageParam: TPageParam }) => Promise<TPageData>;
  initialPageParam: TPageParam;
  getNextPageParam: (lastPage: TPageData) => TPageParam | null | undefined;
};

export type VueInfiniteQueryReactiveReturn<TPageData, TPageParam> = {
  data: ComputedRef<{ pages: TPageData[]; pageParams: TPageParam[] } | undefined>;
  isPending: ComputedRef<boolean>;
  hasNextPage: ComputedRef<boolean>;
  isFetchingNextPage: ComputedRef<boolean>;
  fetchNextPage: () => void;
};

export function ChimericInfiniteQueryFactory<TPageData, TPageParam>(config: {
  queryClient: QueryClient;
  getInfiniteQueryOptions: () => VueInfiniteQueryGetOptions<TPageData, TPageParam>;
}): {
  useHook: () => VueInfiniteQueryReactiveReturn<TPageData, TPageParam>;
} {
  return {
    useHook(): VueInfiniteQueryReactiveReturn<TPageData, TPageParam> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = useInfiniteQuery(config.getInfiniteQueryOptions() as any);

      return {
        data: computed(() =>
          query.data.value
            ? {
                pages: query.data.value.pages as TPageData[],
                pageParams: query.data.value.pageParams as TPageParam[],
              }
            : undefined,
        ),
        isPending: query.isPending as ComputedRef<boolean>,
        hasNextPage: query.hasNextPage as ComputedRef<boolean>,
        isFetchingNextPage: query.isFetchingNextPage as ComputedRef<boolean>,
        fetchNextPage: () => {
          void query.fetchNextPage();
        },
      };
    },
  };
}
