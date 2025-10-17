/* eslint-disable @typescript-eslint/no-explicit-any */
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';
import { fuseChimericInfiniteQuery } from './fuseChimericInfiniteQuery';

describe('fuseChimericInfiniteQuery', () => {
  // USAGE TESTS
  it('USAGE: no params', async () => {
    const {
      idiomaticInfiniteQuery,
      idiomaticFn,
      reactiveInfiniteQuery,
      reactiveFn,
      fetchNextPageFn,
      fetchPreviousPageFn,
      refetchFn,
    } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    // Test idiomatic interface - call without options
    const idiomaticResultWithoutOptions = await chimericInfiniteQuery();
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(idiomaticResultWithoutOptions).toHaveProperty('pages');
    expect(idiomaticResultWithoutOptions).toHaveProperty('pageParams');

    // Test idiomatic interface - call with options
    const idiomaticResultWithOptions = await chimericInfiniteQuery({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(2);
    expect(idiomaticResultWithOptions).toHaveProperty('pages');
    expect(idiomaticResultWithOptions).toHaveProperty('pageParams');

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericInfiniteQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);
    expect(reactiveResultWithoutOptions.data).toHaveProperty('pages');
    expect(reactiveResultWithoutOptions.data).toHaveProperty('pageParams');
    expect(reactiveResultWithoutOptions).toHaveProperty('fetchNextPage');
    expect(reactiveResultWithoutOptions).toHaveProperty('fetchPreviousPage');
    expect(reactiveResultWithoutOptions).toHaveProperty('refetch');

    // Test reactive interface - use with options
    const resultWithOptions = chimericInfiniteQuery.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive pagination functions
    await expect(
      reactiveResultWithoutOptions.fetchNextPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.fetchPreviousPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchPreviousPageFn).toHaveBeenCalledWith();
    expect(fetchPreviousPageFn).toHaveBeenCalledTimes(1);

    await expect(reactiveResultWithoutOptions.refetch()).resolves.toHaveProperty(
      'pages',
    );
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: with params', async () => {
    const {
      idiomaticInfiniteQuery,
      idiomaticFn,
      reactiveInfiniteQuery,
      reactiveFn,
      fetchNextPageFn,
      fetchPreviousPageFn,
      refetchFn,
    } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    // Test idiomatic interface - call without options
    const idiomaticResultWithoutOptions = await chimericInfiniteQuery({
      search: '1',
    });
    expect(idiomaticFn).toHaveBeenCalledWith({ search: '1' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(idiomaticResultWithoutOptions).toHaveProperty('pages');
    expect(idiomaticResultWithoutOptions).toHaveProperty('pageParams');

    // Test idiomatic interface - call with options
    const idiomaticResultWithOptions = await chimericInfiniteQuery(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledWith(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);
    expect(idiomaticResultWithOptions).toHaveProperty('pages');
    expect(idiomaticResultWithOptions).toHaveProperty('pageParams');

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericInfiniteQuery.use({
      search: '1',
    });
    expect(reactiveFn).toHaveBeenCalledWith({ search: '1' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericInfiniteQuery.use(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledWith(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive pagination functions
    await expect(
      reactiveResultWithoutOptions.fetchNextPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchNextPageFn).toHaveBeenCalledWith();
    expect(fetchNextPageFn).toHaveBeenCalledTimes(1);

    await expect(
      resultWithOptions.fetchPreviousPage(),
    ).resolves.toHaveProperty('pages');
    expect(fetchPreviousPageFn).toHaveBeenCalledWith();
    expect(fetchPreviousPageFn).toHaveBeenCalledTimes(1);

    await expect(reactiveResultWithoutOptions.refetch()).resolves.toHaveProperty(
      'pages',
    );
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);
  });

  it('USAGE: optional params', async () => {
    const {
      idiomaticInfiniteQuery,
      idiomaticFn,
      reactiveInfiniteQuery,
      reactiveFn,
    } = InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    // Test idiomatic interface - call with params without options
    const idiomaticResultWithParamsWithoutOptions = await chimericInfiniteQuery({
      search: '1',
    });
    expect(idiomaticFn).toHaveBeenCalledWith({ search: '1' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);
    expect(idiomaticResultWithParamsWithoutOptions).toHaveProperty('pages');
    expect(idiomaticResultWithParamsWithoutOptions).toHaveProperty('pageParams');

    // Test idiomatic interface - call with params with options
    const idiomaticResultWithParamsWithOptions = await chimericInfiniteQuery(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledWith(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);
    expect(idiomaticResultWithParamsWithOptions).toHaveProperty('pages');
    expect(idiomaticResultWithParamsWithOptions).toHaveProperty('pageParams');

    // Test idiomatic interface - call without params without options
    const idiomaticResultWithoutParamsWithoutOptions = await chimericInfiniteQuery();
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(3);
    expect(idiomaticResultWithoutParamsWithoutOptions).toHaveProperty('pages');
    expect(idiomaticResultWithoutParamsWithoutOptions).toHaveProperty('pageParams');

    // Test idiomatic interface - call without params with options
    const idiomaticResultWithoutParamsWithOptions = await chimericInfiniteQuery(
      undefined,
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(4);
    expect(idiomaticResultWithoutParamsWithOptions).toHaveProperty('pages');
    expect(idiomaticResultWithoutParamsWithOptions).toHaveProperty('pageParams');

    // Test reactive interface - use without params without options
    const reactiveResultWithoutParamsWithoutOptions = chimericInfiniteQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use without params with options
    chimericInfiniteQuery.use(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use with params without options
    const resultWithParams = chimericInfiniteQuery.use({ search: '1' });
    expect(reactiveFn).toHaveBeenCalledWith({ search: '1' });
    expect(reactiveFn).toHaveBeenCalledTimes(3);

    // Test reactive interface - use with params with options
    chimericInfiniteQuery.use(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledWith(
      { search: '1' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledTimes(4);

    // Test reactive pagination functions - with params (each result has its own functions)
    await expect(resultWithParams.fetchNextPage()).resolves.toHaveProperty(
      'pages',
    );
    expect(resultWithParams.fetchNextPage).toHaveBeenCalledTimes(1);

    await expect(resultWithParams.refetch()).resolves.toHaveProperty('pages');
    expect(resultWithParams.refetch).toHaveBeenCalledTimes(1);

    // Test reactive pagination functions - without params
    await expect(
      reactiveResultWithoutParamsWithoutOptions.fetchNextPage(),
    ).resolves.toHaveProperty('pages');
    expect(
      reactiveResultWithoutParamsWithoutOptions.fetchNextPage,
    ).toHaveBeenCalledTimes(1);

    await expect(
      reactiveResultWithoutParamsWithoutOptions.refetch(),
    ).resolves.toHaveProperty('pages');
    expect(reactiveResultWithoutParamsWithoutOptions.refetch).toHaveBeenCalledTimes(
      1,
    );
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericInfiniteQuery({ search: '1' });

      const result = chimericInfiniteQuery.use();
      // @ts-expect-error testing invalid call
      result.data.nonExistent();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericInfiniteQuery();

      // @ts-expect-error testing invalid call
      chimericInfiniteQuery.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticInfiniteQuery, reactiveInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericInfiniteQuery(1);

      // @ts-expect-error testing invalid call
      chimericInfiniteQuery.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const {
      idiomaticInfiniteQuery,
      reactiveInfiniteQuery,
      annotation: _annotation,
    } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericInfiniteQuery: TestAnnotation = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });
    expect(chimericInfiniteQuery).toBeDefined();
  });

  it('ANNOTATION: with params', async () => {
    const {
      idiomaticInfiniteQuery,
      reactiveInfiniteQuery,
      annotation: _annotation,
    } = InfiniteQueryTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericInfiniteQuery: TestAnnotation = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });
    expect(chimericInfiniteQuery).toBeDefined();
  });

  it('ANNOTATION: optional params', async () => {
    const {
      idiomaticInfiniteQuery,
      reactiveInfiniteQuery,
      annotation: _annotation,
    } = InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericInfiniteQuery: TestAnnotation = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });
    expect(chimericInfiniteQuery).toBeDefined();
  });
});
