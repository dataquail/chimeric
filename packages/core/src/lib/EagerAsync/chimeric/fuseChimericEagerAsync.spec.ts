import {
  ChimericEagerAsyncWithoutParamsReturnsString,
  ChimericEagerAsyncWithParamsReturnsString,
  makeEagerAsyncHookWithoutParamsReturnsString,
  makeEagerAsyncHookWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

describe('fuseChimericEagerAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithoutParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithParamsReturnsString(),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveEagerAsync.useEagerAsync).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithoutParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.useEagerAsync();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithParamsReturnsString(),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.useEagerAsync({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should handle type annotations with no params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithoutParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericEagerAsync: ChimericEagerAsyncWithoutParamsReturnsString =
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticEagerAsync,
        reactive: mockReactiveEagerAsync,
      });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticEagerAsync = makeAsyncFnWithParamsReturnsString();
    const mockReactiveEagerAsync = {
      useEagerAsync: makeEagerAsyncHookWithParamsReturnsString(),
    };
    const testChimericEagerAsync: ChimericEagerAsyncWithParamsReturnsString =
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticEagerAsync,
        reactive: mockReactiveEagerAsync,
      });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
