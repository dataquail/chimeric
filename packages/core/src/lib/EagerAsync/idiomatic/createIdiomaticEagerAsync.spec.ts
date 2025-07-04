/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticEagerAsync } from './createIdiomaticEagerAsync';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticEagerAsyncWithoutParamsReturnsString,
  IdiomaticEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';

describe('createIdiomaticEagerAsync', () => {
  it('should create an idiomatic eager async function', () => {
    const mockAsyncFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticAsync = createIdiomaticEagerAsync(mockAsyncFn);
    expect(typeof idiomaticAsync).toBe('function');
    expect(idiomaticAsync).toBe(mockAsyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticEagerAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic eager async');
  });

  it('should handle type annotations with no params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithoutParamsReturnsString();
    const testIdiomaticEagerAsync: IdiomaticEagerAsyncWithoutParamsReturnsString =
      createIdiomaticEagerAsync(mockIdiomaticEagerAsync);
    const result = await testIdiomaticEagerAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithParamsReturnsString();
    const testIdiomaticEagerAsync: IdiomaticEagerAsyncWithParamsReturnsString =
      createIdiomaticEagerAsync(mockIdiomaticEagerAsync);
    const result = await testIdiomaticEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
