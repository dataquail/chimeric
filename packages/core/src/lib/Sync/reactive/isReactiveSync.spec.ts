import { makeReactiveSyncWithoutParamsReturnsString } from '../__tests__/syncFixtures';
import { isReactiveSync } from './isReactiveSync';

describe('isReactiveSync', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveSync = makeReactiveSyncWithoutParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return true for a function with use property', () => {
    const mockReactiveSync = makeReactiveSyncWithoutParamsReturnsString();

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveSync('not an object')).toBe(false);
    expect(isReactiveSync(123)).toBe(false);
    expect(isReactiveSync(null)).toBe(false);
    expect(isReactiveSync(undefined)).toBe(false);
    expect(isReactiveSync({})).toBe(false);
    expect(isReactiveSync({ notUse: 'something' })).toBe(false);
    expect(isReactiveSync({ use: 'not a function' })).toBe(false);
  });
});
