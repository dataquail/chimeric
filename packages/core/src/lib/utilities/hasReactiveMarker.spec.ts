/* eslint-disable @typescript-eslint/no-explicit-any */
import { hasReactiveMarker } from './hasReactiveMarker';
import { TYPE_MARKERS } from './typeMarkers';
import { markReactive } from './markReactive';

describe('hasReactiveMarker', () => {
  it('should return true for objects marked with the specified reactive marker', () => {
    const obj = { use: () => 'test' };
    markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    expect(hasReactiveMarker(obj, TYPE_MARKERS.REACTIVE_QUERY)).toBe(true);
  });

  it('should return false for objects marked with a different reactive marker', () => {
    const obj = { use: () => 'test' };
    markReactive(obj, TYPE_MARKERS.REACTIVE_QUERY);

    expect(hasReactiveMarker(obj, TYPE_MARKERS.REACTIVE_MUTATION)).toBe(false);
  });

  it('should return false for unmarked objects', () => {
    const obj = { use: () => 'test' };

    expect(hasReactiveMarker(obj, TYPE_MARKERS.REACTIVE_QUERY)).toBe(false);
  });

  it('should return false for null', () => {
    expect(hasReactiveMarker(null, TYPE_MARKERS.REACTIVE_QUERY)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(hasReactiveMarker(undefined, TYPE_MARKERS.REACTIVE_QUERY)).toBe(
      false,
    );
  });

  it('should return false for primitive values', () => {
    expect(hasReactiveMarker('string', TYPE_MARKERS.REACTIVE_QUERY)).toBe(
      false,
    );
    expect(hasReactiveMarker(42, TYPE_MARKERS.REACTIVE_QUERY)).toBe(false);
    expect(hasReactiveMarker(true, TYPE_MARKERS.REACTIVE_QUERY)).toBe(false);
  });

  it('should work with functions that have use property', () => {
    const fn = () => undefined;
    (fn as any).use = () => 'test';
    markReactive(fn as any, TYPE_MARKERS.REACTIVE_SYNC);

    expect(hasReactiveMarker(fn, TYPE_MARKERS.REACTIVE_SYNC)).toBe(true);
    expect(hasReactiveMarker(fn, TYPE_MARKERS.REACTIVE_ASYNC)).toBe(false);
  });
});
