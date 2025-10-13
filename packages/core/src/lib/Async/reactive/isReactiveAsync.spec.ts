/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncTestFixtures } from '../__tests__/asyncFixtures';
import { isReactiveAsync } from './isReactiveAsync';

describe('isReactiveAsync', () => {
  it('should return true for an object with use function', () => {
    const { reactiveAsync: mockReactiveAsync } = AsyncTestFixtures.withoutParams.getReactive();

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return true for a function with use property', () => {
    const { reactiveAsync: mockReactiveAsync } = AsyncTestFixtures.withoutParams.getReactive();

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveAsync('not an object' as any)).toBe(false);
    expect(isReactiveAsync(123 as any)).toBe(false);
    expect(isReactiveAsync(null as any)).toBe(false);
    expect(isReactiveAsync(undefined as any)).toBe(false);
    expect(isReactiveAsync({} as any)).toBe(false);
    expect(isReactiveAsync({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveAsync({ use: 'not a function' } as any)).toBe(false);
  });
});
