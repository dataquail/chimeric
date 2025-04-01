import { createIdiomaticMutation } from '../Mutation';

describe('createIdiomaticMutation', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticMutation = vi.fn(async () => 'test');
    const testChimericMutation = createIdiomaticMutation(mockIdiomaticMutation);
    const result = await testChimericMutation();
    expect(result).toEqual('test');
    expect(mockIdiomaticMutation).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticMutation = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const testChimericMutation = createIdiomaticMutation(mockIdiomaticMutation);
    const result = await testChimericMutation({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticMutation).toHaveBeenCalledWith({ name: 'John' });
  });
});
