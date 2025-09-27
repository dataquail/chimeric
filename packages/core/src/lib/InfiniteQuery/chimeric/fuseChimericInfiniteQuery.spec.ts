/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChimericInfiniteQueryWithoutParams,
  makeIdiomaticInfiniteQueryWithoutParams,
  makeIdiomaticInfiniteQueryWithParams,
  makeReactiveInfiniteQueryWithoutParams,
  makeReactiveInfiniteQueryWithParams,
} from '../__tests__/infiniteQueryFixtures';
import { IdiomaticInfiniteQuery } from '../idiomatic/types';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';

describe('fuseChimericInfiniteQuery', () => {
  it('should invoke the idiomatic async function for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithoutParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithoutParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery();
    expect(result).toHaveProperty('pages');
    expect(result).toHaveProperty('pageParams');
    expect(result.pages).toBeInstanceOf(Array);
    expect(mockIdiomaticQuery).toHaveBeenCalled();
    expect(mockReactiveQuery.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery({ search: '1' });
    expect(result).toHaveProperty('pages');
    expect(result).toHaveProperty('pageParams');
    expect(mockIdiomaticQuery).toHaveBeenCalledWith({ search: '1' });
    expect(mockReactiveQuery.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithoutParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithoutParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use();
    expect(result.data).toHaveProperty('pages');
    expect(result.data).toHaveProperty('pageParams');
    expect(result).toHaveProperty('fetchNextPage');
    expect(result).toHaveProperty('fetchPreviousPage');
    expect(result).toHaveProperty('hasNextPage');
    expect(result).toHaveProperty('hasPreviousPage');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use({ search: '1' });
    expect(result.data).toHaveProperty('pages');
    expect(result.data).toHaveProperty('pageParams');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.use).toHaveBeenCalled();
  });

  it('should invoke pagination methods (fetchNextPage, fetchPreviousPage)', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use({ search: '1' });

    await result.fetchNextPage();
    expect(result.fetchNextPage).toHaveBeenCalled();

    await result.fetchPreviousPage();
    expect(result.fetchPreviousPage).toHaveBeenCalled();

    await result.refetch();
    expect(result.refetch).toHaveBeenCalled();

    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticQuery = vi.fn(async () => ({
      pages: [],
      pageParams: [],
    })) as IdiomaticInfiniteQuery<undefined, any, any>;
    const invalidReactive = {
      notUse: vi.fn(),
    };

    expect(() => {
      fuseChimericInfiniteQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: invalidReactive as any,
      });
    }).toThrow();
  });

  it('should handle type annotations without params for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithoutParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithoutParams();
    const testChimericQuery: ChimericInfiniteQueryWithoutParams =
      fuseChimericInfiniteQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      });
    const result = await testChimericQuery();
    expect(result).toHaveProperty('pages');
    expect(result.pages[0]).toHaveProperty('items');
  });

  it('should handle type annotations with params for infinite query', async () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery({ search: '1' });
    expect(result).toHaveProperty('pages');
    expect(result).toHaveProperty('pageParams');
  });

  it('should track pagination state correctly', () => {
    const mockIdiomaticQuery = makeIdiomaticInfiniteQueryWithoutParams();
    const mockReactiveQuery = makeReactiveInfiniteQueryWithoutParams();
    const testChimericQuery = fuseChimericInfiniteQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use();

    expect(result).toHaveProperty('hasNextPage');
    expect(result).toHaveProperty('hasPreviousPage');
    expect(result).toHaveProperty('isFetchingNextPage');
    expect(result).toHaveProperty('isFetchingPreviousPage');
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });
});
