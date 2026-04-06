import { infiniteQueryOptions } from '@tanstack/react-query';
import { ReactiveInfiniteQueryFactory } from './ReactiveInfiniteQueryFactory.server';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('ReactiveInfiniteQueryFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const { queryFn } = InfiniteQueryTestFixtures.withoutParams.getReactive();

    expect(() =>
      ReactiveInfiniteQueryFactory({
        getInfiniteQueryOptions: () =>
          infiniteQueryOptions({
            queryKey: ['test'],
            queryFn,
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveInfiniteQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const { queryFn } = InfiniteQueryTestFixtures.withParams.getReactive();

    expect(() =>
      ReactiveInfiniteQueryFactory({
        getInfiniteQueryOptions: (args: { search: string }) =>
          infiniteQueryOptions({
            queryKey: ['test', args.search],
            queryFn: () => queryFn(args),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveInfiniteQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const { queryFn } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    expect(() =>
      ReactiveInfiniteQueryFactory({
        getInfiniteQueryOptions: (args?: { search: string }) =>
          infiniteQueryOptions({
            queryKey: args?.search ? ['test', args.search] : ['test'],
            queryFn: () => queryFn(args),
            initialPageParam: 0,
            getNextPageParam: () => undefined,
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveInfiniteQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
