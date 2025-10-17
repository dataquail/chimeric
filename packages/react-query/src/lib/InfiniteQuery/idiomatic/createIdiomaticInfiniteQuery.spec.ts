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
    // Usage implementation test
    const resultWithoutOptions = await idiomaticInfiniteQuery();
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
    const resultWithOptions = await idiomaticInfiniteQuery({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Item 1' }] }],
      pageParams: [0],
    });
  });

  it('USAGE: with params', async () => {
    const { fn, idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withParams.getIdiomatic();
    // Usage implementation test
    const resultWithoutOptions = await idiomaticInfiniteQuery({
      search: 'test',
    });
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ search: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithoutOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    const resultWithOptions = await idiomaticInfiniteQuery(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
  });

  it('USAGE: optional params', async () => {
    const { fn, idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withOptionalParams.getIdiomatic();
    // Usage implementation test
    const resultWithParamsWithoutOptions = await idiomaticInfiniteQuery({
      search: 'test',
    });
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith({ search: 'test' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(resultWithParamsWithoutOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    const resultWithParamsWithOptions = await idiomaticInfiniteQuery(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith(
      { search: 'test' },
      { options: undefined, nativeOptions: undefined },
    );
    expect(fn).toHaveBeenCalledTimes(2);
    expect(resultWithParamsWithOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'Filtered by test' }] }],
      pageParams: [0],
    });
    const resultWithoutParamsWithoutOptions = await idiomaticInfiniteQuery();
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(resultWithoutParamsWithoutOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
    const resultWithoutParamsWithOptions = await idiomaticInfiniteQuery(
      undefined,
      {
        options: undefined,
        nativeOptions: undefined,
      },
    );
    expect(idiomaticInfiniteQuery).toHaveBeenCalledWith(undefined, {
      options: undefined,
      nativeOptions: undefined,
    });
    expect(fn).toHaveBeenCalledTimes(4);
    expect(resultWithoutParamsWithOptions).toEqual({
      pages: [{ items: [{ id: 1, name: 'All items' }] }],
      pageParams: [0],
    });
  });

  // TYPE ERROR TESTS
  it('TYPE ERRORS: no params', async () => {
    const { idiomaticInfiniteQuery } =
      InfiniteQueryTestFixtures.withoutParams.getIdiomatic();

    try {
      // @ts-expect-error testing invalid call
      await idiomaticInfiniteQuery({ search: 'test' });
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