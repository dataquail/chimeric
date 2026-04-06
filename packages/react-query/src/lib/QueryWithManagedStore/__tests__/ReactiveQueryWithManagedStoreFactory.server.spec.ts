import { queryOptions } from '@tanstack/react-query';
import { ReactiveQueryWithManagedStoreFactory } from '../ReactiveQueryWithManagedStoreFactory.server';

describe('ReactiveQueryWithManagedStoreFactoryServer', () => {
  it('throws when constructing with no params', () => {
    const queryFn = vi.fn(async () => {
      // No-op
    });

    expect(() =>
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test'],
            queryFn,
          }),
        useFromStore: () => 'test',
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryWithManagedStoreFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with params', () => {
    const queryFn = vi.fn(async (_args: { name: string }) => {
      // No-op
    });

    expect(() =>
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test', args.name],
            queryFn: () => queryFn(args),
          }),
        useFromStore: () => 'test',
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryWithManagedStoreFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });

  it('throws when constructing with optional params', () => {
    const queryFn = vi.fn(async (_args?: { name: string }) => {
      // No-op
    });

    expect(() =>
      ReactiveQueryWithManagedStoreFactory({
        getQueryOptions: (args?: { name: string }) =>
          queryOptions({
            queryKey: args?.name ? ['test', args.name] : ['test'],
            queryFn: () => queryFn(args),
          }),
        useFromStore: () => 'test',
      }),
    ).toThrow(
      "@chimeric/react-query: ReactiveQueryWithManagedStoreFactory() is not available in server components. It uses React hooks which cannot be called outside of client components.",
    );
  });
});
