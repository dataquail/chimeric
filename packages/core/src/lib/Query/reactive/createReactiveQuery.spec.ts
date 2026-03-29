/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryTestFixtures } from '../__tests__/queryFixtures';
import { createReactiveQuery } from './createReactiveQuery';

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const { fn, usePrefetchHookFn } =
      QueryTestFixtures.withoutParams.getReactive();
    const reactiveQuery = createReactiveQuery(fn, usePrefetchHookFn);

    expect(typeof reactiveQuery).toBe('object');
    expect(reactiveQuery).toHaveProperty('useHook');
    expect(typeof reactiveQuery.useHook).toBe('function');
  });

  it('should attach usePrefetchHook to the reactive query', () => {
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();
    expect(typeof reactiveQuery.usePrefetchHook).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveQuery(invalidInput as any, vi.fn());
    }).toThrow('reactiveFn is not qualified to be reactive query');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, refetchFn, reactiveQuery } =
      QueryTestFixtures.withoutParams.getReactive();

    // Usage implementation test - use() calls
    const resultWithoutOptions = reactiveQuery.useHook();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveQuery.useHook({
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
    const resultWithoutOptions = reactiveQuery.useHook({ name: 'John' });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);

    const resultWithOptions = reactiveQuery.useHook(
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
    const resultWithParamsWithoutOptions = reactiveQuery.useHook({
      name: 'John',
    });
    expect(fn).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);

    reactiveQuery.useHook(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);

    // Usage implementation test - use() calls without params
    const resultWithoutParamsWithoutOptions = reactiveQuery.useHook();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);

    reactiveQuery.useHook(undefined, {
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
      reactiveQuery.useHook({ fake: 'option' });
    } catch {
      // Expected to throw
    }

    const result = reactiveQuery.useHook();
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
      reactiveQuery.useHook();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call
      reactiveQuery.useHook(1);
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

  // PREFETCH USAGE TESTS
  it('PREFETCH USAGE: no params', () => {
    const { usePrefetchHookFn, reactiveQuery } =
      QueryTestFixtures.withoutParams.getReactive();

    // Call without options
    reactiveQuery.usePrefetchHook();
    expect(usePrefetchHookFn).toHaveBeenCalledWith();
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(1);

    // Call with options
    reactiveQuery.usePrefetchHook({
      nativeOptions: undefined,
    });
    expect(usePrefetchHookFn).toHaveBeenCalledWith({
      nativeOptions: undefined,
    });
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(2);

    // Returns void
    const result = reactiveQuery.usePrefetchHook();
    expect(result).toBeUndefined();
  });

  it('PREFETCH USAGE: with params', () => {
    const { usePrefetchHookFn, reactiveQuery } =
      QueryTestFixtures.withParams.getReactive();

    // Call with params without options
    reactiveQuery.usePrefetchHook({ name: 'John' });
    expect(usePrefetchHookFn).toHaveBeenCalledWith({ name: 'John' });
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(1);

    // Call with params with options
    reactiveQuery.usePrefetchHook(
      { name: 'John' },
      { nativeOptions: undefined },
    );
    expect(usePrefetchHookFn).toHaveBeenCalledWith(
      { name: 'John' },
      { nativeOptions: undefined },
    );
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(2);
  });

  it('PREFETCH USAGE: optional params', () => {
    const { usePrefetchHookFn, reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    // Call with params
    reactiveQuery.usePrefetchHook({ name: 'John' });
    expect(usePrefetchHookFn).toHaveBeenCalledWith({ name: 'John' });
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(1);

    // Call without params
    reactiveQuery.usePrefetchHook();
    expect(usePrefetchHookFn).toHaveBeenCalledWith();
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(2);

    // Call without params with options
    reactiveQuery.usePrefetchHook(undefined, {
      nativeOptions: undefined,
    });
    expect(usePrefetchHookFn).toHaveBeenCalledWith(undefined, {
      nativeOptions: undefined,
    });
    expect(usePrefetchHookFn).toHaveBeenCalledTimes(3);
  });

  // PREFETCH TYPE ERROR TESTS
  it('PREFETCH TYPE ERRORS: no params', () => {
    const { reactiveQuery } = QueryTestFixtures.withoutParams.getReactive();

    try {
      // @ts-expect-error testing invalid call - no params variant shouldn't accept params
      reactiveQuery.usePrefetchHook({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('PREFETCH TYPE ERRORS: with params', () => {
    const { reactiveQuery } = QueryTestFixtures.withParams.getReactive();

    try {
      // @ts-expect-error testing invalid call - required params variant must have params
      reactiveQuery.usePrefetchHook();
    } catch {
      // Expected to throw
    }
  });

  it('PREFETCH TYPE ERRORS: optional params', () => {
    const { reactiveQuery } =
      QueryTestFixtures.withOptionalParams.getReactive();

    try {
      // @ts-expect-error testing invalid call - wrong param type
      reactiveQuery.usePrefetchHook(1);
    } catch {
      // Expected to throw
    }
  });
});
