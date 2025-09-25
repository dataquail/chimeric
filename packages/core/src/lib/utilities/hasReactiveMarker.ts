import { TypeMarker } from './typeMarkers';

export function hasReactiveMarker(
  target: unknown,
  marker: TypeMarker,
): boolean {
  return (
    target !== null &&
    target !== undefined &&
    (typeof target === 'object' || typeof target === 'function') &&
    'reactive' in target &&
    (target as { reactive: unknown }).reactive === marker
  );
}
