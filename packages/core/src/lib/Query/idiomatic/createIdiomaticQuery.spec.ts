/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticQuery } from './createIdiomaticQuery';

describe('createIdiomaticQuery', () => {
  it('should create an idiomatic query function', () => {
    const mockQueryFn = vi.fn(async () => 'test');
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    expect(typeof idiomaticQuery).toBe('function');
    expect(idiomaticQuery).toBe(mockQueryFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticQuery(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic query');
  });

  it('should invoke the idiomatic function without params', () => {
    const mockQueryFn = vi.fn(async () => 'test');
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', () => {
    const mockQueryFn = vi.fn(
      async (params: { name: string }) => `Hello ${params.name}`,
    );
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
