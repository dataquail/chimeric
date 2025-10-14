/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { fuseChimericQuery } from './fuseChimericQuery';

describe('fuseChimericQuery', () => {
  // USAGE TESTS
  it('USAGE: no params', async () => {
    const {
      idiomaticQuery,
      idiomaticFn,
      reactiveQuery,
      reactiveFn,
      refetchFn,
    } = QueryTestFixtures.withoutParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    // Test idiomatic interface - call without options
    await expect(chimericQuery()).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericQuery({
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('test');
    expect(idiomaticFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericQuery.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive refetch - without options
    await expect(resultWithOptions.refetch()).resolves.toBe('test');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    // Test reactive refetch - with options
    await expect(reactiveResultWithoutOptions.refetch()).resolves.toBe('test');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const {
      idiomaticQuery,
      idiomaticFn,
      reactiveQuery,
      reactiveFn,
      refetchFn,
    } = QueryTestFixtures.withParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    // Test idiomatic interface - call without options
    await expect(chimericQuery({ name: 'John' })).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with options
    await expect(
      chimericQuery(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericQuery.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    const resultWithOptions = chimericQuery.use(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive refetch
    await expect(resultWithOptions.refetch()).resolves.toBe('Hello John');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    await expect(reactiveResultWithoutOptions.refetch()).resolves.toBe(
      'Hello John',
    );
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: optional params', async () => {
    const { idiomaticQuery, idiomaticFn, reactiveQuery, reactiveFn } =
      QueryTestFixtures.withOptionalParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    // Test idiomatic interface - call with params without options
    await expect(chimericQuery({ name: 'John' })).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith({ name: 'John' });
    expect(idiomaticFn).toHaveBeenCalledTimes(1);

    // Test idiomatic interface - call with params with options
    await expect(
      chimericQuery(
        { name: 'John' },
        {
          options: undefined,
          nativeOptions: undefined,
        },
      ),
    ).resolves.toBe('Hello John');
    expect(idiomaticFn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticFn).toHaveBeenCalledTimes(2);

    // Test idiomatic interface - call without params without options
    await expect(chimericQuery()).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith();
    expect(idiomaticFn).toHaveBeenCalledTimes(3);

    // Test idiomatic interface - call without params with options
    await expect(
      chimericQuery(undefined, {
        options: undefined,
        nativeOptions: undefined,
      }),
    ).resolves.toBe('Hello');
    expect(idiomaticFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticFn).toHaveBeenCalledTimes(4);

    // Test reactive interface - use without options
    const reactiveResultWithoutOptions = chimericQuery.use();
    expect(reactiveFn).toHaveBeenCalledWith();
    expect(reactiveFn).toHaveBeenCalledTimes(1);

    // Test reactive interface - use with options
    chimericQuery.use(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(reactiveFn).toHaveBeenCalledTimes(2);

    // Test reactive interface - use with params
    const resultWithParams = chimericQuery.use({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveFn).toHaveBeenCalledTimes(3);

    // Test reactive refetch - with params (each result has its own refetch)
    await expect(resultWithParams.refetch()).resolves.toBe('Hello John');
    expect(resultWithParams.refetch).toHaveBeenCalledTimes(1);

    // Test reactive refetch - without params
    await expect(reactiveResultWithoutOptions.refetch()).resolves.toBe('Hello');
    expect(reactiveResultWithoutOptions.refetch).toHaveBeenCalledTimes(1);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withoutParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericQuery({ name: 'John' });

      const result = chimericQuery.use();
      // @ts-expect-error testing invalid call
      result.data.nonExistent();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericQuery();

      // @ts-expect-error testing invalid call
      chimericQuery.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticQuery, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getChimeric();
    const chimericQuery = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });

    try {
      // @ts-expect-error testing invalid call
      await chimericQuery(1);

      // @ts-expect-error testing invalid call
      chimericQuery.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const {
      idiomaticQuery,
      reactiveQuery,
      annotation: _annotation,
    } = QueryTestFixtures.withoutParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericQuery: TestAnnotation = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });
    expect(chimericQuery).toBeDefined();
  });

  it('ANNOTATION: with params', async () => {
    const {
      idiomaticQuery,
      reactiveQuery,
      annotation: _annotation,
    } = QueryTestFixtures.withParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericQuery: TestAnnotation = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });
    expect(chimericQuery).toBeDefined();
  });

  it('ANNOTATION: optional params', async () => {
    const {
      idiomaticQuery,
      reactiveQuery,
      annotation: _annotation,
    } = QueryTestFixtures.withOptionalParams.getChimeric();
    type TestAnnotation = typeof _annotation;
    const chimericQuery: TestAnnotation = fuseChimericQuery({
      idiomatic: idiomaticQuery,
      reactive: reactiveQuery,
    });
    expect(chimericQuery).toBeDefined();
  });
});
