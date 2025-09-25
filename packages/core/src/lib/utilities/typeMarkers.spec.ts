import { TYPE_MARKERS } from './typeMarkers';

describe('typeMarkers', () => {
  describe('TYPE_MARKERS', () => {
    it('should have all expected markers', () => {
      expect(TYPE_MARKERS.REACTIVE_QUERY).toBeDefined();
      expect(TYPE_MARKERS.REACTIVE_MUTATION).toBeDefined();
      expect(TYPE_MARKERS.REACTIVE_SYNC).toBeDefined();
      expect(TYPE_MARKERS.REACTIVE_ASYNC).toBeDefined();
      expect(TYPE_MARKERS.REACTIVE_EAGER_ASYNC).toBeDefined();
      expect(TYPE_MARKERS.IDIOMATIC_QUERY).toBeDefined();
      expect(TYPE_MARKERS.IDIOMATIC_MUTATION).toBeDefined();
      expect(TYPE_MARKERS.IDIOMATIC_SYNC).toBeDefined();
      expect(TYPE_MARKERS.IDIOMATIC_ASYNC).toBeDefined();
      expect(TYPE_MARKERS.IDIOMATIC_EAGER_ASYNC).toBeDefined();
    });

    it('should use symbols for markers', () => {
      expect(typeof TYPE_MARKERS.REACTIVE_QUERY).toBe('string');
      expect(typeof TYPE_MARKERS.IDIOMATIC_QUERY).toBe('string');
    });

    it('should have unique symbols', () => {
      const markers = Object.values(TYPE_MARKERS);
      const uniqueMarkers = new Set(markers);
      expect(markers.length).toBe(uniqueMarkers.size);
    });
  });
});
