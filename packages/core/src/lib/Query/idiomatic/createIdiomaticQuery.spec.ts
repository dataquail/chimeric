/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticQueryWithoutParamsReturnsString,
  IdiomaticQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { createIdiomaticQuery } from './createIdiomaticQuery';

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
  });

  it('should handle type annotations with params', async () => {
    const mockQueryFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticQuery: IdiomaticQueryWithParamsReturnsString =
      createIdiomaticQuery(mockQueryFn);
    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
  });
});
