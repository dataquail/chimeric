import { fuseChimericQuery } from '../Query';

describe('fuseChimericQuery', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test');
    const mockReactiveQuery = vi.fn(() => ({
      refetch: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery();
    expect(result).toEqual('test');
    expect(mockIdiomaticQuery).toHaveBeenCalled();
    expect(mockReactiveQuery).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveQuery = vi.fn((args: { name: string }) => ({
      refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = await testChimericQuery({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test');
    const mockReactiveQuery = vi.fn(() => ({
      refetch: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveQuery = vi.fn((args: { name: string }) => ({
      refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockRefetchFunction = vi.fn(() => Promise.resolve(`Hello John`));
    const mockReactiveQuery = vi.fn(() => ({
      refetch: mockRefetchFunction,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });
    const result = testChimericQuery.useQuery({ name: 'John' });
    await result.refetch();
    expect(mockIdiomaticQuery).not.toHaveBeenCalled();
    expect(mockReactiveQuery).toHaveBeenCalled();
    expect(mockRefetchFunction).toHaveBeenCalled();
  });
});
