/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticQuery } from './createIdiomaticQuery';
import {
  makeAsyncFnWithOptionalParamsReturnsString,
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticQueryWithOptionalParamsReturnsString,
  IdiomaticQueryWithoutParamsReturnsString,
  IdiomaticQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';

describe('createIdiomaticQuery', () => {
  it('should create an idiomatic query function', () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(typeof idiomaticQuery).toBe('function');
    expect(idiomaticQuery).toBe(mockQueryFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticQuery(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic query');
  });

  it('should invoke the idiomatic function without params', async () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations without params', async () => {
    const mockQueryFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithoutParamsReturnsString =
      createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithParamsReturnsString =
      createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle optional params', async () => {
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const resultWithParams = await idiomaticQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await idiomaticQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledWith();
  });

  it('should handle type annotations with optional params', async () => {
    const mockQueryFn = makeAsyncFnWithOptionalParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithOptionalParamsReturnsString =
      createIdiomaticQuery(mockQueryFn);

    const resultWithParams = await idiomaticQuery({ name: 'John' });

    expect(resultWithParams).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });

    const resultWithoutParams = await idiomaticQuery();

    expect(resultWithoutParams).toBe('Hello');
    expect(mockQueryFn).toHaveBeenCalledWith();
  });
});
