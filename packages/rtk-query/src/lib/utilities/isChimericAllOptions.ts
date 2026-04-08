/**
 * Detects whether a single argument to a chimeric function is an allOptions
 * object rather than params. This is needed because RTK factories use
 * `...args` spread and cannot determine param arity from a config function
 * like the tanstack factories do (via `getQueryOptions.length`).
 *
 * For void-params endpoints, the TypeScript type routes the first argument
 * to allOptions, but at runtime we need to distinguish:
 *   - `useHook({ options: { enabled: false } })` → allOptions (void params)
 *   - `useHook({ name: 'John' })`                → params (with params)
 *
 * The heuristic: an object whose keys are exclusively `options` and/or
 * `nativeOptions` is treated as allOptions.
 */
export function isChimericAllOptions(arg: unknown): boolean {
  if (arg === null || arg === undefined || typeof arg !== 'object') return false;
  if (Array.isArray(arg)) return false;
  const keys = Object.keys(arg);
  return (
    keys.length > 0 &&
    keys.every((k) => k === 'options' || k === 'nativeOptions')
  );
}
