/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';
import { createReactiveInfiniteQuery } from './createReactiveInfiniteQuery';

describe('createReactiveInfiniteQuery', () => {
  it('should create a reactive infinite query function', () => {
    const { fn } = InfiniteQueryTestFixtures.withoutParams.getReactive();
    const reactiveInfiniteQuery = createReactiveInfiniteQuery(fn);

    expect(typeof reactiveInfiniteQuery).toBe('object');
    expect(reactiveInfiniteQuery).toHaveProperty('use');
    expect(typeof reactiveInfiniteQuery.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveInfiniteQuery(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive infinite query');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const {
      fn,
      fetchNextPageFn,
      fetchPreviousPageFn,
      refetchFn,
      reactiveInfiniteQuery,
    } = InfiniteQueryTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveInfiniteQuery.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveInfiniteQuery.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - fetchNextPage() calls
    await expect(resultWithoutOptions.fetchNextPage()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(resultWithOptions.fetchNextPage()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(2);

    // Usage implementation test - fetchPreviousPage() calls
    await expect(resultWithoutOptions.fetchPreviousPage()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(fetchPreviousPageFn).toHaveBeenCalledWith();
    expect(fetchPreviousPageFn).toHaveBeenCalledTimes(1);

    // Usage implementation test - refetch() calls
    await expect(resultWithoutOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const { fn, fetchNextPageFn, refetchFn, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveInfiniteQuery.use({ search: 'test' });
    expect(fn).toHaveBeenCalledWith({ search: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveInfiniteQuery.use(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - fetchNextPage() calls
    await expect(resultWithoutOptions.fetchNextPage()).resolves.toEqual({
      pages: [{ items: [{ id: 2, name: 'Filtered by test - Page 2' }] }],
      pageParams: [1],
    });
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(resultWithOptions.fetchNextPage()).resolves.toEqual({
      pages: [{ items: [{ id: 2, name: 'Filtered by test - Page 2' }] }],
      pageParams: [1],
    });
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(2);

    // Usage implementation test - refetch() calls
    await expect(resultWithoutOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: optional params', async () => {
    const { fn, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls with params
    const resultWithParamsWithoutOptions = reactiveInfiniteQuery.use({
      search: 'test',
    });
    expect(fn).toHaveBeenCalledWith({ search: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);

    reactiveInfiniteQuery.use(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - use() calls without params
    const resultWithoutParamsWithoutOptions = reactiveInfiniteQuery.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);

    reactiveInfiniteQuery.use(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);

    // Test that the results include proper data
    expect(resultWithParamsWithoutOptions.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });

    expect(resultWithoutParamsWithoutOptions.data).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveInfiniteQuery.use({ search: 'test' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveInfiniteQuery.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveInfiniteQuery.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { reactiveInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveInfiniteQuery;
    expect(testAnnotation).toBe(reactiveInfiniteQuery);
  });

  it('ANNOTATION: with params', async () => {
    const { reactiveInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveInfiniteQuery;
    expect(testAnnotation).toBe(reactiveInfiniteQuery);
  });

  it('ANNOTATION: optional params', async () => {
    const { reactiveInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveInfiniteQuery;
    expect(testAnnotation).toBe(reactiveInfiniteQuery);
  });
});
