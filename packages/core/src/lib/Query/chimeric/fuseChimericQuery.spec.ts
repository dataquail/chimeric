/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdiomaticQuery } from '../idiomatic/types';
import { fuseChimericQuery } from './fuseChimericQuery';
import { DefineChimericQuery } from './types';

describe('fuseChimericQuery', () => {
  it('should invoke the idiomatic async function', async () => {
    type TestChimericQuery = DefineChimericQuery<() => Promise<string>>;

    const mockIdiomaticQuery = vi.fn(async () => 'test');
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        refetch: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    const testChimericQuery: TestChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery();
    expect(result).toEqual('test');
    expect(mockIdiomaticQuery).toHaveBeenCalled();
    expect(mockReactiveQuery.useQuery).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveQuery = {
      useQuery: vi.fn((args: { name: string }) => ({
        refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
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
    const mockIdiomaticQuery = vi.fn(async () => 'test');
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        refetch: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
      })),
    };
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
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveQuery = {
      useQuery: vi.fn((args: { name: string }) => ({
        refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
      })),
    };
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
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockRefetchFunction = vi.fn(() => Promise.resolve(`Hello John`));
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        refetch: mockRefetchFunction,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
        reset: vi.fn(),
      })),
    };
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery({ name: 'John' });
    await result.refetch();
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery.useQuery).toHaveBeenCalled();
    expect(mockRefetchFunction).toHaveBeenCalled();
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test') as IdiomaticQuery<
      void,
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

  // it('should defineChimericQuery', () => {
  //   // never
  //   type TestChimericQueryWithOptions = DefineChimericQuery<
  //     (args: { options: string }) => Promise<string>
  //   >;
  //   // never
  //   type TestChimericQueryWithStringArgs = DefineChimericQuery<
  //     (name: string) => Promise<string>
  //   >;
  //   // never
  //   type TestChimericQueryWithCorrectArgsButIncorrectOptions =
  //     DefineChimericQuery<
  //       (args: { name: string; options: string }) => Promise<string>
  //     >;
  //   // ok
  //   type TestChimericQueryWithCorrectArgs = DefineChimericQuery<
  //     (args: { name: string }) => Promise<string>
  //   >;
  // });
});
