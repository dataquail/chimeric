import { TypeMarker } from './typeMarkers';

export function hasIdiomaticMarker(
  target: unknown,
  marker: TypeMarker,
): boolean {
  return (
    target !== null &&
    target !== undefined &&
    (typeof target === 'object' || typeof target === 'function') &&
    'idiomatic' in target &&
    (target as { idiomatic: unknown }).idiomatic === marker
  );
}
