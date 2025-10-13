/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { createReactiveQuery } from './createReactiveQuery';

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const { fn } = QueryTestFixtures.withoutParams.getReactive();
    const reactiveQuery = createReactiveQuery(fn);

    expect(typeof reactiveQuery).toBe('object');
    expect(reactiveQuery).toHaveProperty('use');
    expect(typeof reactiveQuery.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveQuery(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive query');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, refetchFn, reactiveQuery } =
      QueryTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveQuery.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveQuery.use({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - refetch() calls
    await expect(resultWithoutOptions.refetch()).resolves.toBe('test');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    await expect(resultWithOptions.refetch()).resolves.toBe('test');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: with params', async () => {
    const { fn, refetchFn, reactiveQuery } =
      QueryTestFixtures.withParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveQuery.use({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveQuery.use(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - refetch() calls
    await expect(resultWithoutOptions.refetch()).resolves.toBe('Hello John');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(1);

    await expect(resultWithOptions.refetch()).resolves.toBe('Hello John');
    expect(refetchFn).toHaveBeenCalledWith();
    expect(refetchFn).toHaveBeenCalledTimes(2);
  });

  it('USAGE: optional params', async () => {
    const { fn, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    // Usage implementation test - use() calls with params
    const resultWithParamsWithoutOptions = reactiveQuery.use({
      name: 'John',
    });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);

    reactiveQuery.use(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - use() calls without params
    const resultWithoutParamsWithoutOptions = reactiveQuery.use();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);

    reactiveQuery.use(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);

    // Usage implementation test - refetch() calls
    // Each result should have its own refetch that knows about its params
    await expect(resultWithParamsWithoutOptions.refetch()).resolves.toBe(
      'Hello John',
    );
    expect(resultWithParamsWithoutOptions.refetch).toHaveBeenCalledTimes(1);

    await expect(resultWithoutParamsWithoutOptions.refetch()).resolves.toBe(
      'Hello',
    );
    expect(resultWithoutParamsWithoutOptions.refetch).toHaveBeenCalledTimes(1);
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveQuery.use({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveQuery.use();
    try {
      // @ts-expect-error testing invalid call
      result.data.nonExistent();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveQuery.use();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveQuery.use(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { reactiveQuery, annotation: _annotation } =
      QueryTestFixtures.withoutParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveQuery;
    expect(testAnnotation).toBe(reactiveQuery);
  });

  it('ANNOTATION: with params', async () => {
    const { reactiveQuery, annotation: _annotation } =
      QueryTestFixtures.withParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveQuery;
    expect(testAnnotation).toBe(reactiveQuery);
  });

  it('ANNOTATION: optional params', async () => {
    const { reactiveQuery, annotation: _annotation } =
      QueryTestFixtures.withOptionalParams.getReactive();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = reactiveQuery;
    expect(testAnnotation).toBe(reactiveQuery);
  });
});
