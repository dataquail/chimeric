import {
  fuseChimericQuery,
  createIdiomaticQuery,
  createReactiveQuery,
  isIdiomaticQuery,
  isReactiveQuery,
  isChimericQuery,
} from '../Query';
import { IdiomaticQuery } from '../../types/Query';

describe('fuseChimericQuery', () => {
  it('should fuse idiomatic and reactive query functions', () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test') as IdiomaticQuery<
      void,
      string
    >;
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve('test')),
      })),
    };

    const chimericQuery = fuseChimericQuery({
      idiomatic: mockIdiomaticQuery,
      reactive: mockReactiveQuery,
    });

    expect(typeof chimericQuery).toBe('function');
    expect(chimericQuery).toBe(mockIdiomaticQuery);
    expect(chimericQuery.useQuery).toBe(mockReactiveQuery.useQuery);
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticQuery = vi.fn(async () => 'test') as IdiomaticQuery<
      void,
      string
    >;
    const invalidReactive = {
      notUseQuery: vi.fn(),
    };

    expect(() => {
      fuseChimericQuery({
        idiomatic: mockIdiomaticQuery,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric query');
  });
});

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
});

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
    }));

    const reactiveQuery = createReactiveQuery(mockReactiveFn);

    expect(typeof reactiveQuery).toBe('object');
    expect(reactiveQuery).toHaveProperty('useQuery');
    expect(typeof reactiveQuery.useQuery).toBe('function');
    expect(reactiveQuery.useQuery).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveQuery(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive query');
  });
});

describe('isIdiomaticQuery', () => {
  it('should return true for a function', () => {
    const mockQueryFn = vi.fn(async () => 'test');

    expect(isIdiomaticQuery(mockQueryFn)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticQuery('not a function')).toBe(false);
    expect(isIdiomaticQuery(123)).toBe(false);
    expect(isIdiomaticQuery({})).toBe(false);
    expect(isIdiomaticQuery(null)).toBe(false);
    expect(isIdiomaticQuery(undefined)).toBe(false);
  });
});

describe('isReactiveQuery', () => {
  it('should return true for an object with useQuery function', () => {
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve('test')),
      })),
    };

    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return true for a function with useQuery property', () => {
    const mockReactiveQuery = vi.fn(() => 'test') as any;
    mockReactiveQuery.useQuery = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
    }));

    expect(isReactiveQuery(mockReactiveQuery)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveQuery('not an object')).toBe(false);
    expect(isReactiveQuery(123)).toBe(false);
    expect(isReactiveQuery(null)).toBe(false);
    expect(isReactiveQuery(undefined)).toBe(false);
    expect(isReactiveQuery({})).toBe(false);
    expect(isReactiveQuery({ notUseQuery: 'something' })).toBe(false);
    expect(isReactiveQuery({ useQuery: 'not a function' })).toBe(false);
  });
});

describe('isChimericQuery', () => {
  it('should return true for a chimeric query function', () => {
    const mockChimericQuery = vi.fn(async () => 'test') as any;
    mockChimericQuery.useQuery = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
    }));

    expect(isChimericQuery(mockChimericQuery)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericQuery('not a function')).toBe(false);

    // Function without useQuery
    const mockQueryFn = vi.fn(async () => 'test');
    expect(isChimericQuery(mockQueryFn)).toBe(false);

    // Object with useQuery but not a function
    const mockReactiveQuery = {
      useQuery: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve('test')),
      })),
    };
    expect(isChimericQuery(mockReactiveQuery)).toBe(false);

    // Other invalid inputs
    expect(isChimericQuery(123)).toBe(false);
    expect(isChimericQuery(null)).toBe(false);
    expect(isChimericQuery(undefined)).toBe(false);
    expect(isChimericQuery({})).toBe(false);
  });
});
