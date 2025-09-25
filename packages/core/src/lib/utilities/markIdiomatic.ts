import { TypeMarker } from './typeMarkers';

export function markIdiomatic<T extends object>(
  target: T,
  marker: TypeMarker,
): T {
  Object.defineProperty(target, 'idiomatic', {
    value: marker,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return target;
}
