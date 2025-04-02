import { fuseChimericMutation } from '../Mutation';

describe('fuseChimericMutation', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticMutation = vi.fn(async () => 'test');
    const mockReactiveMutation = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
    }));
    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });
    const result = await testChimericMutation();
    expect(result).toEqual('test');
    expect(mockIdiomaticMutation).toHaveBeenCalled();
    expect(mockReactiveMutation).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticMutation = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveMutation = vi.fn(() => ({
      call: vi.fn((args: { name: string }) =>
        Promise.resolve(`Hello ${args.name}`),
      ),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
    }));
    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });
    const result = await testChimericMutation({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticMutation).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveMutation).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticMutation = vi.fn(async () => 'test');
    const mockReactiveMutation = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
      reset: vi.fn(),
    }));
    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticMutation).not.toHaveBeenCalled();
    expect(mockReactiveMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticMutation = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveMutation = vi.fn(() => ({
      call: vi.fn((args: { name: string }) =>
        Promise.resolve(`Hello ${args.name}`),
      ),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticMutation).not.toHaveBeenCalled();
    expect(mockReactiveMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticMutation = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockCallFunction = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const mockReactiveMutation = vi.fn(() => ({
      call: mockCallFunction,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });
    const result = testChimericMutation.useMutation();
    await result.call({ name: 'John' });
    expect(mockIdiomaticMutation).not.toHaveBeenCalled();
    expect(mockReactiveMutation).toHaveBeenCalled();
    expect(mockCallFunction).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
