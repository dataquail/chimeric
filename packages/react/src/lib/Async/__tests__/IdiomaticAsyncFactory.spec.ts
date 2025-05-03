import { IdiomaticAsyncFactory } from '../IdiomaticAsyncFactory';

describe('IdiomaticAsyncFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const mockPromise = vi.fn(() => Promise.resolve('test'));
    const idiomaticPromise = IdiomaticAsyncFactory(mockPromise);
    const result = await idiomaticPromise();

    expect(result).toBe('test');
    expect(mockPromise).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const mockPromise = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const idiomaticPromise = IdiomaticAsyncFactory(mockPromise);
    const result = await idiomaticPromise({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should retry the fn', async () => {
    const mockPromise = vi.fn(() => Promise.reject(new Error('test')));
    const idiomaticPromise = IdiomaticAsyncFactory(mockPromise);
    try {
      await idiomaticPromise({ options: { retry: 3 } });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('test');
    }
    expect(mockPromise).toHaveBeenCalledTimes(3);
  });
});
