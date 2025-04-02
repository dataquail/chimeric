import { createReactivePromise } from '../Promise';

describe('createReactivePromise', () => {
  it('should invoke the reactive function', async () => {
    const mockReactivePromise = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericPromise = createReactivePromise(mockReactivePromise);
    const result = testChimericPromise.usePromise();
    expect(result.data).toEqual('test');
    expect(mockReactivePromise).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockReactivePromise = vi.fn(() => ({
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
    const testChimericPromise = createReactivePromise(mockReactivePromise);
    const result = testChimericPromise.usePromise();
    expect(result.data).toEqual('Hello John');
    expect(mockReactivePromise).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockCallFunction = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const mockReactivePromise = vi.fn(() => ({
      call: mockCallFunction,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(),
    }));
    const testChimericPromise = createReactivePromise(mockReactivePromise);
    const result = testChimericPromise.usePromise();
    await result.call({ name: 'John' });
    expect(mockReactivePromise).toHaveBeenCalled();
    expect(mockCallFunction).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
