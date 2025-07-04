/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { createIdiomaticAsync } from './createIdiomaticAsync';
import {
  IdiomaticAsyncWithoutParamsReturnsString,
  IdiomaticAsyncWithParamsReturnsString,
} from '../__tests__/asyncFixtures';

describe('createIdiomaticAsync', () => {
  it('should create an idiomatic async function', () => {
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticAsync = createIdiomaticAsync(mockAsyncFn);
    expect(typeof idiomaticAsync).toBe('function');
    expect(idiomaticAsync).toBe(mockAsyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic async');
  });

  it('should handle type annotations with no params', async () => {
    const mockIdiomaticAsync = makeAsyncFnWithoutParamsReturnsString();
    const testIdiomaticAsync: IdiomaticAsyncWithoutParamsReturnsString =
      createIdiomaticAsync(mockIdiomaticAsync);
    const result = await testIdiomaticAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticAsync = makeAsyncFnWithParamsReturnsString();
    const testIdiomaticAsync: IdiomaticAsyncWithParamsReturnsString =
      createIdiomaticAsync(mockIdiomaticAsync);
    const result = await testIdiomaticAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
