import { hasIdiomaticMarker } from './hasIdiomaticMarker';
import { TYPE_MARKERS } from './typeMarkers';
import { markIdiomatic } from './markIdiomatic';

describe('hasIdiomaticMarker', () => {
  it('should return true for objects marked with the specified idiomatic marker', () => {
    const fn = () => 'test';
    markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    expect(hasIdiomaticMarker(fn, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(true);
  });

  it('should return false for objects marked with a different idiomatic marker', () => {
    const fn = () => 'test';
    markIdiomatic(fn, TYPE_MARKERS.IDIOMATIC_QUERY);

    expect(hasIdiomaticMarker(fn, TYPE_MARKERS.IDIOMATIC_MUTATION)).toBe(false);
  });

  it('should return false for unmarked objects', () => {
    const fn = () => 'test';

    expect(hasIdiomaticMarker(fn, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(false);
  });

  it('should return false for null', () => {
    expect(hasIdiomaticMarker(null, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(hasIdiomaticMarker(undefined, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(
      false,
    );
  });

  it('should return false for primitive values', () => {
    expect(hasIdiomaticMarker('string', TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(
      false,
    );
    expect(hasIdiomaticMarker(42, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(false);
    expect(hasIdiomaticMarker(true, TYPE_MARKERS.IDIOMATIC_QUERY)).toBe(false);
  });

  it('should work with objects', () => {
    const obj = { test: 'value' };
    markIdiomatic(obj, TYPE_MARKERS.IDIOMATIC_SYNC);

    expect(hasIdiomaticMarker(obj, TYPE_MARKERS.IDIOMATIC_SYNC)).toBe(true);
    expect(hasIdiomaticMarker(obj, TYPE_MARKERS.IDIOMATIC_ASYNC)).toBe(false);
  });
});
