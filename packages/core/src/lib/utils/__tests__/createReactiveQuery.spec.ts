import { createReactiveQuery } from '../Query';

describe('createReactiveQuery', () => {
  it('should invoke the reactive function', async () => {
    const mockReactiveQuery = vi.fn(() => ({
      refetch: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericQuery = createReactiveQuery(mockReactiveQuery);
    const result = testChimericQuery.useQuery();
    expect(result.data).toEqual('test');
    expect(mockReactiveQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
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
    const testChimericQuery = createReactiveQuery(mockReactiveQuery);
    const result = testChimericQuery.useQuery({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockReactiveQuery).toHaveBeenCalled();
  });

  it('should invoke the reactive refetch function', async () => {
    const mockRefetchFunction = vi.fn(() => Promise.resolve(`Hello John`));
    const mockReactiveQuery = vi.fn((args: { name: string }) => ({
      refetch: mockRefetchFunction,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericQuery = createReactiveQuery(mockReactiveQuery);
    const result = testChimericQuery.useQuery({ name: 'John' });
    await result.refetch();
    expect(mockReactiveQuery).toHaveBeenCalled();
    expect(mockRefetchFunction).toHaveBeenCalled();
  });
});
