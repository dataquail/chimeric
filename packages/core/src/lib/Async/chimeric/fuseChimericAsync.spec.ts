import { fuseChimericAsync } from './fuseChimericAsync';
import {
  ChimericAsyncWithoutParamsReturnsString,
  ChimericAsyncWithParamsReturnsString,
  makeIdiomaticAsyncWithoutParamsReturnsString,
  makeIdiomaticAsyncWithParamsReturnsString,
  makeReactiveAsyncWithoutParamsReturnsString,
  makeReactiveAsyncWithParamsReturnsString,
} from '../__tests__/asyncFixtures';

describe('fuseChimericAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithoutParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).toHaveBeenCalled();
    expect(mockReactiveAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithoutParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = testChimericAsync.use();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.use().invoke({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.use).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = testChimericAsync.use();
    const callResult = await result.invoke({ name: 'John' });
    expect(callResult).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.use).toHaveBeenCalled();
    expect(result.invoke).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should invoke reactive with params and options', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.use({ retry: 0 }).invoke({
      name: 'John',
    });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.use).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should invoke reactive without params but with options', async () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithoutParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.use({ retry: 0 }).invoke();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.use).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should handle type annotations without params', async () => {
    const mockIdiomaticAsyncWithoutParams =
      makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsyncWithoutParams =
      makeReactiveAsyncWithoutParamsReturnsString();
    const testChimericAsyncWithoutParams: ChimericAsyncWithoutParamsReturnsString =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithoutParams,
        reactive: mockReactiveAsyncWithoutParams,
      });
    const idiomaticResult = await testChimericAsyncWithoutParams();
    const reactiveResult = testChimericAsyncWithoutParams.use();
    expect(idiomaticResult).toEqual('test');
    expect(mockIdiomaticAsyncWithoutParams).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('test');
    expect(mockReactiveAsyncWithoutParams.use).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticAsyncWithParams =
      makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsyncWithParams =
      makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsyncWithParams: ChimericAsyncWithParamsReturnsString =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithParams,
        reactive: mockReactiveAsyncWithParams,
      });
    const idiomaticResult = await testChimericAsyncWithParams({ name: 'John' });
    const reactiveResult = testChimericAsyncWithParams.use();
    expect(idiomaticResult).toEqual('Hello John');
    expect(mockIdiomaticAsyncWithParams).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsyncWithParams.use).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('Hello John');
  });
});
