import { createIdiomaticPromise } from '../Promise';

describe('createIdiomaticPromise', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticPromise = vi.fn(async () => 'test');
    const testChimericPromise = createIdiomaticPromise(mockIdiomaticPromise);
    const result = await testChimericPromise();
    expect(result).toEqual('test');
    expect(mockIdiomaticPromise).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticPromise = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const testChimericPromise = createIdiomaticPromise(mockIdiomaticPromise);
    const result = await testChimericPromise({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticPromise).toHaveBeenCalledWith({ name: 'John' });
  });
});
