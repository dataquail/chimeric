/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticInfiniteQuery } from './createIdiomaticInfiniteQuery';
import { InfiniteQueryTestFixtures } from '../__tests__/infiniteQueryFixtures';

describe('createIdiomaticInfiniteQuery', () => {
  it('should create an idiomatic infinite query function', () => {
    const { fn } = InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
    const idiomaticInfiniteQuery = createIdiomaticInfiniteQuery(fn);
    expect(typeof idiomaticInfiniteQuery).toBe('function');
    expect(idiomaticInfiniteQuery).toBe(fn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticInfiniteQuery(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic infinite query');
  });

  // USAGE TESTS
  it('USAGE: no params', async () => {
    const { fn, idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();
    
    // Usage implementation test - call without options
    const resultWithoutOptions = await idiomaticInfiniteQuery();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toHaveProperty('pages');
    expect(resultWithoutOptions).toHaveProperty('pageParams');
    expect(resultWithoutOptions.pages).toBeInstanceOf(Array);
    expect(resultWithoutOptions.pageParams).toBeInstanceOf(Array);

    // Usage implementation test - call with options
    const resultWithOptions = await idiomaticInfiniteQuery({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toHaveProperty('pages');
    expect(resultWithOptions).toHaveProperty('pageParams');
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();
    
    // Usage implementation test - call without options
    const resultWithoutOptions = await idiomaticInfiniteQuery({
      search: '1',
    });
    expect(fn).toHaveBeenCalledWith({ search: '1' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toHaveProperty('pages');
    expect(resultWithoutOptions).toHaveProperty('pageParams');

    // Usage implementation test - call with options
    const resultWithOptions = await idiomaticInfiniteQuery(
      { search: '1' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: '1' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toHaveProperty('pages');
    expect(resultWithOptions).toHaveProperty('pageParams');
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
    
    // Usage implementation test - call with params without options
    const resultWithParamsWithoutOptions = await idiomaticInfiniteQuery({
      search: '1',
    });
    expect(fn).toHaveBeenCalledWith({ search: '1' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParamsWithoutOptions).toHaveProperty('pages');
    expect(resultWithParamsWithoutOptions).toHaveProperty('pageParams');

    // Usage implementation test - call with params with options
    const resultWithParamsWithOptions = await idiomaticInfiniteQuery(
      { search: '1' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(
      { search: '1' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithParamsWithOptions).toHaveProperty('pages');
    expect(resultWithParamsWithOptions).toHaveProperty('pageParams');

    // Usage implementation test - call without params without options
    const resultWithoutParamsWithoutOptions = await idiomaticInfiniteQuery();
    expect(fn).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(resultWithoutParamsWithoutOptions).toHaveProperty('pages');
    expect(resultWithoutParamsWithoutOptions).toHaveProperty('pageParams');

    // Usage implementation test - call without params with options
    const resultWithoutParamsWithOptions = await idiomaticInfiniteQuery(
      undefined,
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);
    expect(resultWithoutParamsWithOptions).toHaveProperty('pages');
    expect(resultWithoutParamsWithOptions).toHaveProperty('pageParams');
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticInfiniteQuery({ search: '1' });
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: with params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticInfiniteQuery();
    } catch {
      // Expected to throw
    }
  });

  it('TYPE ERRORS: optional params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticInfiniteQuery(1);
    } catch {
      // Expected to throw
    }
  });

  // ANNOTATION TESTS
  it('ANNOTATION: no params', async () => {
    const { idiomaticInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticInfiniteQuery;
    expect(testAnnotation).toBe(idiomaticInfiniteQuery);
  });

  it('ANNOTATION: with params', async () => {
    const { idiomaticInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticInfiniteQuery;
    expect(testAnnotation).toBe(idiomaticInfiniteQuery);
  });

  it('ANNOTATION: optional params', async () => {
    const { idiomaticInfiniteQuery, annotation: _annotation } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();

    type TestAnnotation = typeof _annotation;
    const testAnnotation: TestAnnotation = idiomaticInfiniteQuery;
    expect(testAnnotation).toBe(idiomaticInfiniteQuery);
  });
});
