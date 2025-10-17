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
      refetchFn,
    } = InfiniteQueryTestFixtures.withoutParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    // Test idiomatic interface - call without options
    await expect(chimericInfiniteQuery()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericInfiniteQuery({
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericInfiniteQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

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

    // Test reactive refetch - without options
    await expect(resultWithOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    // Test reactive refetch - with options
    await expect(reactiveResultWithoutOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const {
      idiomaticInfiniteQuery,
      idiomaticFn,
      reactiveInfiniteQuery,
      reactiveFn,
      refetchFn,
    } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    // Test idiomatic interface - call without options
    await expect(chimericInfiniteQuery({ search: 'test' })).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith({ search: 'test' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericInfiniteQuery(
        { search: 'test' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericInfiniteQuery.use({
      search: 'test',
    });
    expect(reactiveFn).toHaveBeenCalledWith({ search: 'test' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericInfiniteQuery.use(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledWith(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive refetch
    await expect(resultWithOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    await expect(reactiveResultWithoutOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
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
    await expect(chimericInfiniteQuery({ search: 'test' })).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith({ search: 'test' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with params with options
    await expect(
      chimericInfiniteQuery(
        { search: 'test' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith(
      { search: 'test' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test idiomatic interface - call without params without options
    await expect(chimericInfiniteQuery()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(3);

    // Test idiomatic interface - call without params with options
    await expect(
      chimericInfiniteQuery(undefined, {
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(idiomaticFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(4);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericInfiniteQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    chimericInfiniteQuery.use(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use with params
    const resultWithParams = chimericInfiniteQuery.use({ search: 'test' });
    expect(reactiveFn).toHaveBeenCalledWith({ search: 'test' });
    expect(reactiveFn).toHaveBeenCalledTimes(3);

    // Test reactive refetch - with params (each result has its own refetch)
    await expect(resultWithParams.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    expect(resultWithParams.refetch).toHaveBeenCalledTimes(1);

    // Test reactive refetch - without params
    await expect(reactiveResultWithoutOptions.refetch()).resolves.toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    expect(reactiveResultWithoutOptions.refetch).toHaveBeenCalledTimes(1);
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
      await chimericInfiniteQuery({ search: 'test' });

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
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericInfiniteQuery;
    expect(testAnnotation).toBe(chimericInfiniteQuery);
  });

  it('ANNOTATION: with params', async () => {
    const {
      idiomaticInfiniteQuery,
      reactiveInfiniteQuery,
      annotation: _annotation,
    } = InfiniteQueryTestFixtures.withParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericInfiniteQuery;
    expect(testAnnotation).toBe(chimericInfiniteQuery);
  });

  it('ANNOTATION: optional params', async () => {
    const {
      idiomaticInfiniteQuery,
      reactiveInfiniteQuery,
      annotation: _annotation,
    } = InfiniteQueryTestFixtures.withOptionalParams.getChimeric();
    const chimericInfiniteQuery = fuseChimericInfiniteQuery({
      idiomatic: idiomaticInfiniteQuery,
      reactive: reactiveInfiniteQuery,
    });

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = chimericInfiniteQuery;
    expect(testAnnotation).toBe(chimericInfiniteQuery);
  });
});
