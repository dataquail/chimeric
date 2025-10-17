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
    expect(resultWithoutOptions.data).toHaveProperty('pages');
    expect(resultWithoutOptions.data).toHaveProperty('pageParams');
    expect(resultWithoutOptions).toHaveProperty('fetchNextPage');
    expect(resultWithoutOptions).toHaveProperty('fetchPreviousPage');
    expect(resultWithoutOptions).toHaveProperty('refetch');

    const resultWithOptions = reactiveInfiniteQuery.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - pagination function calls
    await expect(resultWithoutOptions.fetchNextPage()).resolves.toHaveProperty(
      'pages',
    );
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.fetchPreviousPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchPreviousPageFn).toHaveBeenCalledWith();
    expect(fetchPreviousPageFn).toHaveBeenCalledTimes(1);

    await expect(resultWithoutOptions.refetch()).resolves.toHaveProperty(
      'pages',
    );
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const {
      fn,
      fetchNextPageFn,
      fetchPreviousPageFn,
      refetchFn,
      reactiveInfiniteQuery,
    } = InfiniteQueryTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveInfiniteQuery.use({ search: '1' });
    expect(fn).toHaveBeenCalledWith({ search: '1' });
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveInfiniteQuery.use(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - pagination function calls
    await expect(resultWithoutOptions.fetchNextPage()).resolves.toHaveProperty(
      'pages',
    );
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.fetchPreviousPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchPreviousPageFn).toHaveBeenCalledWith();
    expect(fetchPreviousPageFn).toHaveBeenCalledTimes(1);

    await expect(resultWithoutOptions.refetch()).resolves.toHaveProperty(
      'pages',
    );
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: optional params', async () => {
    const { fn, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls with params
    const resultWithParamsWithoutOptions = reactiveInfiniteQuery.use({
      search: '1',
    });
    expect(fn).toHaveBeenCalledWith({ search: '1' });
    expect(fn).toHaveBeenCalledTimes(1);

    reactiveInfiniteQuery.use(
      { search: '1' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: '1' },
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

    // Usage implementation test - pagination function calls
    // Each result should have its own pagination functions that know about its params
    await expect(
      resultWithParamsWithoutOptions.fetchNextPage(),
    ).resolves.toHaveProperty('pages');
    expect(resultWithParamsWithoutOptions.fetchNextPage).toHaveBeenCalledTimes(
      1,
    );

    await expect(
      resultWithoutParamsWithoutOptions.fetchNextPage(),
    ).resolves.toHaveProperty('pages');
    expect(
      resultWithoutParamsWithoutOptions.fetchNextPage,
    ).toHaveBeenCalledTimes(1);

    await expect(
      resultWithParamsWithoutOptions.refetch(),
    ).resolves.toHaveProperty('pages');
    expect(resultWithParamsWithoutOptions.refetch).toHaveBeenCalledTimes(1);

    await expect(
      resultWithoutParamsWithoutOptions.refetch(),
    ).resolves.toHaveProperty('pages');
    expect(resultWithoutParamsWithoutOptions.refetch).toHaveBeenCalledTimes(1);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveInfiniteQuery.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveInfiniteQuery.use();
    try {
      // @ts-expect-error testing invalid call
      result.data.nonExistent();
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
