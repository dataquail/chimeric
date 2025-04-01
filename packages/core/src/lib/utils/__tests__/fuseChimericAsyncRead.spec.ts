import { fuseChimericAsyncRead } from '../AsyncRead';

describe('fuseChimericAsyncRead', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticAsyncRead = vi.fn(async () => 'test');
    const mockReactiveRead = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));
    const testChimericAsyncRead = fuseChimericAsyncRead({
      idiomatic: mockIdiomaticAsyncRead,
      reactive: mockReactiveRead,
    });
    const result = await testChimericAsyncRead();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsyncRead).toHaveBeenCalled();
    expect(mockReactiveRead).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticAsyncRead = vi.fn(
      async (name: string) => `Hello ${name}`,
    );
    const mockReactiveRead = vi.fn((name: string) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${name}`,
    }));
    const testChimericAsyncRead = fuseChimericAsyncRead({
      idiomatic: mockIdiomaticAsyncRead,
      reactive: mockReactiveRead,
    });
    const result = await testChimericAsyncRead('John');
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsyncRead).toHaveBeenCalledWith('John');
    expect(mockReactiveRead).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticAsyncRead = vi.fn(async () => 'test');
    const mockReactiveRead = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericAsyncRead = fuseChimericAsyncRead({
      idiomatic: mockIdiomaticAsyncRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericAsyncRead.useAsync();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticAsyncRead).not.toHaveBeenCalled();
    expect(mockReactiveRead).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticAsyncRead = vi.fn(
      async (name: string) => `Hello ${name}`,
    );
    const mockReactiveRead = vi.fn((name: string) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${name}`,
    }));
    const testChimericAsyncRead = fuseChimericAsyncRead({
      idiomatic: mockIdiomaticAsyncRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericAsyncRead.useAsync('John');
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticAsyncRead).not.toHaveBeenCalled();
    expect(mockReactiveRead).toHaveBeenCalledWith('John');
  });
});
