import { fuseChimericPromise } from '../Promise';

describe('fuseChimericPromise', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticPromise = vi.fn(async () => 'test');
    const mockReactivePromise = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));
    const testChimericPromise = fuseChimericPromise({
      idiomatic: mockIdiomaticPromise,
      reactive: mockReactivePromise,
    });
    const result = await testChimericPromise();
    expect(result).toEqual('test');
    expect(mockIdiomaticPromise).toHaveBeenCalled();
    expect(mockReactivePromise).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticPromise = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactivePromise = vi.fn(() => ({
      call: vi.fn((args: { name: string }) =>
        Promise.resolve(`Hello ${args.name}`),
      ),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));
    const testChimericPromise = fuseChimericPromise({
      idiomatic: mockIdiomaticPromise,
      reactive: mockReactivePromise,
    });
    const result = await testChimericPromise({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticPromise).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactivePromise).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticPromise = vi.fn(async () => 'test');
    const mockReactivePromise = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericPromise = fuseChimericPromise({
      idiomatic: mockIdiomaticPromise,
      reactive: mockReactivePromise,
    });
    const result = testChimericPromise.usePromise();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticPromise).not.toHaveBeenCalled();
    expect(mockReactivePromise).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticPromise = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
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
    const testChimericPromise = fuseChimericPromise({
      idiomatic: mockIdiomaticPromise,
      reactive: mockReactivePromise,
    });
    const result = testChimericPromise.usePromise();
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticPromise).not.toHaveBeenCalled();
    expect(mockReactivePromise).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticPromise = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
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
    const testChimericPromise = fuseChimericPromise({
      idiomatic: mockIdiomaticPromise,
      reactive: mockReactivePromise,
    });
    const result = testChimericPromise.usePromise();
    await result.call({ name: 'John' });
    expect(mockIdiomaticPromise).not.toHaveBeenCalled();
    expect(mockReactivePromise).toHaveBeenCalled();
    expect(mockCallFunction).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
