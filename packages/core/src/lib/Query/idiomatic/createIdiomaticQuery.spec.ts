/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticQuery } from './createIdiomaticQuery';
import { QueryTestFixtures } from '../__tests__/queryFixtures';

describe('createIdiomaticQuery', () => {
  it('should create an idiomatic query function', () => {
    const { fn, prefetchFn } = QueryTestFixtures.withoutParams.getIdiomatic();
    const idiomaticQuery = createIdiomaticQuery(fn, prefetchFn);
    expect(typeof idiomaticQuery).toBe('function');
    expect(idiomaticQuery).toBe(fn);
  });

  it('should attach prefetch to the idiomatic query', () => {
    const { idiomaticQuery } = QueryTestFixtures.withoutParams.getIdiomatic();
    expect(typeof idiomaticQuery.prefetch).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticQuery(invalidInput as any, vi.fn());
    }).toThrow('idiomaticFn is not qualified to be idiomatic query');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, idiomaticQuery } =
      QueryTestFixtures.withoutParams.getIdiomatic();
    // Usage implementation test
    const resultWithoutOptions = await idiomaticQuery();
    expect(idiomaticQuery).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toBe('test');
    const resultWithOptions = await idiomaticQuery({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticQuery).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toBe('test');
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticQuery } =
      QueryTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const resultWithoutOptions = await idiomaticQuery({ name: 'John' });
    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toBe('Hello John');
    const resultWithOptions = await idiomaticQuery(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticQuery).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toBe('Hello John');
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParamsWithoutOptions = await idiomaticQuery({
      name: 'John',
    });
    expect(idiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParamsWithoutOptions).toBe('Hello John');
    const resultWithParamsWithOptions = await idiomaticQuery(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticQuery).toHaveBeenCalledWith(
      { name: 'John' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithParamsWithOptions).toBe('Hello John');
    const resultWithoutParamsWithoutOptions = await idiomaticQuery();
    expect(idiomaticQuery).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(resultWithoutParamsWithoutOptions).toBe('Hello');
    const resultWithoutParamsWithOptions = await idiomaticQuery(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticQuery).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);
    expect(resultWithoutParamsWithOptions).toBe('Hello');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticQuery({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticQuery();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticQuery(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticQuery, annotation: _annotation } =
      QueryTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticQuery;
    expect(testAnnotation).toBe(idiomaticQuery);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticQuery, annotation: _annotation } =
      QueryTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticQuery;
    expect(testAnnotation).toBe(idiomaticQuery);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticQuery, annotation: _annotation } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticQuery;
    expect(testAnnotation).toBe(idiomaticQuery);
  });

  // PREFETCH USAGE TESTS
  it('PREFETCH USAGE: no params', async () => {
    const { prefetchFn, idiomaticQuery } =
      QueryTestFixtures.withoutParams.getIdiomatic();

    // Call without options
    await idiomaticQuery.prefetch();
    expect(prefetchFn).toHaveBeenCalledWith();
    expect(prefetchFn).toHaveBeenCalledTimes(1);

    // Call with options
    await idiomaticQuery.prefetch({
      nativeOptions: undefined,
    });
    expect(prefetchFn).toHaveBeenCalledWith({
      nativeOptions: undefined,
    });
    expect(prefetchFn).toHaveBeenCalledTimes(2);

    // Returns void (Promise<void>)
    const result = await idiomaticQuery.prefetch();
    expect(result).toBeUndefined();
  });

  it('PREFETCH USAGE: with params', async () => {
    const { prefetchFn, idiomaticQuery } =
      QueryTestFixtures.withParams.getIdiomatic();

    // Call with params without options
    await idiomaticQuery.prefetch({ name: 'John' });
    expect(prefetchFn).toHaveBeenCalledWith({ name: 'John' });
    expect(prefetchFn).toHaveBeenCalledTimes(1);

    // Call with params with options
    await idiomaticQuery.prefetch(
      { name: 'John' },
      { nativeOptions: undefined },
    );
    expect(prefetchFn).toHaveBeenCalledWith(
      { name: 'John' },
      { nativeOptions: undefined },
    );
    expect(prefetchFn).toHaveBeenCalledTimes(2);
  });

  it('PREFETCH USAGE: optional params', async () => {
    const { prefetchFn, idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    // Call with params
    await idiomaticQuery.prefetch({ name: 'John' });
    expect(prefetchFn).toHaveBeenCalledWith({ name: 'John' });
    expect(prefetchFn).toHaveBeenCalledTimes(1);

    // Call without params
    await idiomaticQuery.prefetch();
    expect(prefetchFn).toHaveBeenCalledWith();
    expect(prefetchFn).toHaveBeenCalledTimes(2);

    // Call without params with options
    await idiomaticQuery.prefetch(undefined, {
      nativeOptions: undefined,
    });
    expect(prefetchFn).toHaveBeenCalledWith(undefined, {
      nativeOptions: undefined,
    });
    expect(prefetchFn).toHaveBeenCalledTimes(3);
  });

  // PREFETCH TYPE ERROR TESTS
  it('PREFETCH TYPE ERRORS: no params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call - no params variant shouldn't accept params
      await idiomaticQuery.prefetch({ name: 'John' });
    } catch {
      // Expected to throw
    }
  });

  it('PREFETCH TYPE ERRORS: with params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call - required params variant must have params
      await idiomaticQuery.prefetch();
    } catch {
      // Expected to throw
    }
  });

  it('PREFETCH TYPE ERRORS: optional params', async () => {
    const { idiomaticQuery } =
      QueryTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call - wrong param type
      await idiomaticQuery.prefetch(1);
    } catch {
      // Expected to throw
    }
  });
});
