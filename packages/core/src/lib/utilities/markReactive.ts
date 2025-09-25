import { TypeMarker } from './typeMarkers';

export function markReactive<T extends object>(
  target: T,
  marker: TypeMarker,
): T {
  Object.defineProperty(target, 'reactive', {
    value: marker,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return target;
}
