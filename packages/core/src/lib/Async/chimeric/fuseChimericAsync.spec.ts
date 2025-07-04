import { fuseChimericAsync } from './fuseChimericAsync';
import {
  ChimericAsyncWithoutParamsReturnsString,
  ChimericAsyncWithParamsReturnsString,
  makeAsyncHookWithoutParamsReturnsString,
  makeAsyncHookWithParamsReturnsString,
  makeIdiomaticAsyncWithoutParamsReturnsString,
  makeIdiomaticAsyncWithParamsReturnsString,
} from '../__tests__/asyncFixtures';

describe('fuseChimericAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsync.useAsync).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = testChimericAsync.useAsync();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync().call({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = testChimericAsync.useAsync();
    const callResult = await result.call({ name: 'John' });
    expect(callResult).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(result.call).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke reactive with params and options', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync({ retry: 0 }).call({
      name: 'John',
    });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should invoke reactive without params but with options', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = {
      useAsync: makeAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync({ retry: 0 }).call();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should handle type annotations without params', async () => {
    const mockIdiomaticAsyncWithoutParams =
      makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsyncWithoutParams = {
      useAsync: makeAsyncHookWithoutParamsReturnsString(),
    };
    const testChimericAsyncWithoutParams: ChimericAsyncWithoutParamsReturnsString =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithoutParams,
        reactive: mockReactiveAsyncWithoutParams,
      });
    const idiomaticResult = await testChimericAsyncWithoutParams();
    const reactiveResult = testChimericAsyncWithoutParams.useAsync();
    expect(idiomaticResult).toEqual('test');
    expect(mockIdiomaticAsyncWithoutParams).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('test');
    expect(mockReactiveAsyncWithoutParams.useAsync).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticAsyncWithParams =
      makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsyncWithParams = {
      useAsync: makeAsyncHookWithParamsReturnsString(),
    };
    const testChimericAsyncWithParams: ChimericAsyncWithParamsReturnsString =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithParams,
        reactive: mockReactiveAsyncWithParams,
      });
    const idiomaticResult = await testChimericAsyncWithParams({ name: 'John' });
    const reactiveResult = testChimericAsyncWithParams.useAsync();
    expect(idiomaticResult).toEqual('Hello John');
    expect(mockIdiomaticAsyncWithParams).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsyncWithParams.useAsync).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('Hello John');
  });
});
