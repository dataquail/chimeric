import { createReactiveAsyncRead } from '../AsyncRead';

describe('createReactiveAsyncRead', () => {
  it('should invoke the reactive function', async () => {
    const mockReactiveRead = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));
    const testChimericAsyncRead = createReactiveAsyncRead(mockReactiveRead);
    const result = testChimericAsyncRead.useAsync();
    expect(result.data).toEqual('test');
    expect(mockReactiveRead).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockReactiveRead = vi.fn((name: string) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${name}`,
    }));
    const testChimericAsyncRead = createReactiveAsyncRead(mockReactiveRead);
    const result = testChimericAsyncRead.useAsync('John');
    expect(result.data).toEqual('Hello John');
    expect(mockReactiveRead).toHaveBeenCalledWith('John');
  });
});
