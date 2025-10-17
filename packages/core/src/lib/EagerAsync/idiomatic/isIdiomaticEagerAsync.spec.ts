/* eslint-disable @typescript-eslint/no-explicit-any */
import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { createIdiomaticEagerAsync } from './createIdiomaticEagerAsync';
import { isIdiomaticEagerAsync } from './isIdiomaticEagerAsync';

describe('isIdiomaticEagerAsync', () => {
  it('should return false for unmarked function', () => {
    expect(isIdiomaticEagerAsync(vi.fn(async () => 'test'))).toBe(false);
  });

  it('should return true for marked function', () => {
    const mockAsyncFn = EagerAsyncTestFixtures.withoutParams.getIdiomatic().fn;
    expect(isIdiomaticEagerAsync(createIdiomaticEagerAsync(mockAsyncFn))).toBe(
      true,
    );
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticEagerAsync('not a function' as any)).toBe(false);
    expect(isIdiomaticEagerAsync(123 as any)).toBe(false);
    expect(isIdiomaticEagerAsync({} as any)).toBe(false);
    expect(isIdiomaticEagerAsync(null as any)).toBe(false);
    expect(isIdiomaticEagerAsync(undefined as any)).toBe(false);
  });
});
