import { makeIdiomaticSyncWithoutParamsReturnsString } from '../__tests__/syncFixtures';
import { isIdiomaticSync } from './isIdiomaticSync';

describe('isIdiomaticSync', () => {
  it('should return true for a function', () => {
    const mockIdiomaticSync = makeIdiomaticSyncWithoutParamsReturnsString();

    expect(isIdiomaticSync(mockIdiomaticSync)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticSync('not a function')).toBe(false);
    expect(isIdiomaticSync(123)).toBe(false);
    expect(isIdiomaticSync({})).toBe(false);
    expect(isIdiomaticSync(null)).toBe(false);
    expect(isIdiomaticSync(undefined)).toBe(false);
  });
});
