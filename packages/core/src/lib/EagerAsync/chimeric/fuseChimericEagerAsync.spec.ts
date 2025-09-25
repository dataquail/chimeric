import {
  ChimericEagerAsyncWithoutParamsReturnsString,
  ChimericEagerAsyncWithParamsReturnsString,
  makeIdiomaticEagerAsyncWithoutParamsReturnsString,
  makeIdiomaticEagerAsyncWithParamsReturnsString,
  makeReactiveEagerAsyncWithoutParamsReturnsString,
  makeReactiveEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

describe('fuseChimericEagerAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithoutParamsReturnsString();
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalled();
    expect(mockReactiveEagerAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithParamsReturnsString();
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveEagerAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithoutParamsReturnsString();
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.use();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithParamsReturnsString();
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.use({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.use).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should handle type annotations with no params', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithoutParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithoutParamsReturnsString();
    const testChimericEagerAsync: ChimericEagerAsyncWithoutParamsReturnsString =
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticEagerAsync,
        reactive: mockReactiveEagerAsync,
      });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticEagerAsync =
      makeIdiomaticEagerAsyncWithParamsReturnsString();
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithParamsReturnsString();
    const testChimericEagerAsync: ChimericEagerAsyncWithParamsReturnsString =
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticEagerAsync,
        reactive: mockReactiveEagerAsync,
      });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
