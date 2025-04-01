import { createReactiveMutation } from '../Mutation';

describe('createReactiveMutation', () => {
  it('should invoke the reactive function', async () => {
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
    const testChimericMutation = createReactiveMutation(mockReactiveMutation);
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('test');
    expect(mockReactiveMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
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
    const testChimericMutation = createReactiveMutation(mockReactiveMutation);
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('Hello John');
    expect(mockReactiveMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
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
    const testChimericMutation = createReactiveMutation(mockReactiveMutation);
    const result = testChimericMutation.useMutation();
    await result.call({ name: 'John' });
    expect(mockReactiveMutation).toHaveBeenCalled();
    expect(mockCallFunction).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
