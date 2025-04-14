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
});
