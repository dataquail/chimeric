import { queryOptions } from '@tanstack/react-query';
import { ReactiveQueryFactory } from './ReactiveQueryFactory.server';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('ReactiveQueryFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const { queryFn } = QueryTestFixtures.withoutParams.getReactive();

    expect(() =>
      ReactiveQueryFactory({
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn,
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const { queryFn } = QueryTestFixtures.withParams.getReactive();

    expect(() =>
      ReactiveQueryFactory({
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => queryFn(args),
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const { queryFn } = QueryTestFixtures.withOptionalParams.getReactive();

    expect(() =>
      ReactiveQueryFactory({
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: () => queryFn(args),
          }),
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
