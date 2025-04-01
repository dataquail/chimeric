import { createIdiomaticAsyncRead } from '../AsyncRead';

describe('createIdiomaticAsyncRead', () => {
  it('should invoke the idiomatic function', async () => {
    const mockIdiomaticAsyncRead = vi.fn(async () => 'test');
    const testChimericAsyncRead = createIdiomaticAsyncRead(
      mockIdiomaticAsyncRead,
    );
    const result = await testChimericAsyncRead();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsyncRead).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticAsyncRead = vi.fn(
      async (name: string) => `Hello ${name}`,
    );
    const testChimericAsyncRead = createIdiomaticAsyncRead(
      mockIdiomaticAsyncRead,
    );
    const result = await testChimericAsyncRead('John');
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsyncRead).toHaveBeenCalledWith('John');
  });
});
