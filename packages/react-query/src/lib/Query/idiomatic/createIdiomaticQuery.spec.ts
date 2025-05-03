/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticQuery } from './createIdiomaticQuery';
import { FetchQueryOptions, QueryKey } from '@tanstack/react-query';
import { IdiomaticQueryOptions } from '@chimeric/core';

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

  it('should invoke the idiomatic function without params', async () => {
    const mockQueryFn = vi.fn(async () => 'test');
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery();

    expect(result).toBe('test');
    expect(mockQueryFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockQueryFn = vi.fn(
      async (params: {
        name: string;
        options?: IdiomaticQueryOptions;
        nativeOptions?: FetchQueryOptions<string, Error, string, QueryKey>;
      }) => `Hello ${params.name}`,
    );
    const idiomaticQuery = createIdiomaticQuery(mockQueryFn);

    const result = await idiomaticQuery({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockQueryFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
