/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChimericQueryWithoutParamsReturnsString,
  ChimericQueryWithParamsReturnsString,
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeIdiomaticQueryWithParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { IdiomaticQuery } from '../idiomatic/types';
import { fuseChimericQuery } from './fuseChimericQuery';

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
    expect(mockReactiveQuery.useQuery).not.toHaveBeenCalled();
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
    expect(mockReactiveQuery.useQuery).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery({ name: 'John' });
    await result.refetch();
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
    expect(result.refetch).toHaveBeenCalled();
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test') as IdiomaticQuery<
      undefined,
      string
    >;
    const invalidReactive = {
      notUseQuery: vi.fn(),
    };

    expect(() => {
      fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: invalidReactive as any,
      });
    });
  });

  it('should handle type annotations without params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithoutParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    const testChimericQuery: ChimericQueryWithoutParamsReturnsString =
      fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      });
    const result = await testChimericQuery();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const mockIdiomaticQuery = makeIdiomaticQueryWithParamsReturnsString();
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();
    const testChimericQuery: ChimericQueryWithParamsReturnsString =
      fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: mockReactiveQuery,
      });
    const result = await testChimericQuery({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
