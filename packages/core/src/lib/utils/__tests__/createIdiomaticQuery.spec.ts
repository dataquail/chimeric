import { createIdiomaticQuery } from '../Query';

describe('createIdiomaticQuery', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test');
    const testChimericQuery = createIdiomaticQuery(mockIdiomaticQuery);
    const result = await testChimericQuery();
    expect(result).toEqual('test');
    expect(mockIdiomaticQuery).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticQuery = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const testChimericQuery = createIdiomaticQuery(mockIdiomaticQuery);
    const result = await testChimericQuery({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticQuery).toHaveBeenCalledWith({ name: 'John' });
  });
});
