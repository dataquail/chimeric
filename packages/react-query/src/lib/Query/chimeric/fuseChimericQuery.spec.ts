/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeIdiomaticQueryWithParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { fuseChimericQuery } from './fuseChimericQuery';
import { DefineChimericQuery } from './types';

describe('fuseChimericQuery', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery();
    expect(result).toEqual('test');
    expect(mockIdiomaticQuery).toHaveBeenCalled();
    expect(mockReactiveQuery.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.use).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.use({ name: 'John' });
    await result.refetch();
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.use).toHaveBeenCalled();
    expect(result.refetch).toHaveBeenCalled();
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const invalidReactive = {
      notuse: vi.fn(),
    };

    expect(() => {
      fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: invalidReactive as any,
      });
    });
  });

  it('should handle type annotations without params', async () => {
    type TestChimericQuery = DefineChimericQuery<() => Promise<string>>;
    const testChimericQuery: TestChimericQuery = fuseChimericQuery({
      idiomatic: makeIdiomaticQueryWithoutParamsReturnsString(),
      reactive: makeReactiveQueryWithoutParamsReturnsString(),
    });

    const result = await testChimericQuery();
    expect(result).toBe('test');
    expect(testChimericQuery).toHaveBeenCalled();
    expect(testChimericQuery.use).not.toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    type TestChimericQuery = DefineChimericQuery<
      (args: { name: string }) => Promise<string>
    >;
    const testChimericQuery: TestChimericQuery = fuseChimericQuery({
      idiomatic: makeIdiomaticQueryWithParamsReturnsString(),
      reactive: makeReactiveQueryWithParamsReturnsString(),
    });

    const result = await testChimericQuery({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(testChimericQuery).toHaveBeenCalled();
    expect(testChimericQuery.use).not.toHaveBeenCalled();
  });
});
