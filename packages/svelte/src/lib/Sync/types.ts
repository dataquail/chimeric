import type { IdiomaticSync, ReactiveSync } from '@chimeric/core';

/**
 * A reactive wrapper that exposes a single reactive value via the `current`
 * getter. This matches Svelte's own `svelte/reactivity` conventions
 * (`SvelteDate.current`, `MediaQuery.current`, `ReactiveValue.current`), and
 * enables reactivity to propagate across the function boundary of a hook
 * return.
 */
export type ReactiveSyncBox<TResult> = {
  readonly current: TResult;
};

/**
 * Svelte-flavored `ChimericSync`.
 *
 * The idiomatic path returns `TResult` directly (a snapshot). The reactive
 * path (`useHook`) returns a `ReactiveSyncBox<TResult>` so that reads of
 * `.current` inside a reactive context (template, `$effect`, `$derived`)
 * stay subscribed to the underlying `$state`.
 */
export type ChimericSyncSvelte<TParams = void, TResult = unknown> =
  IdiomaticSync<TParams, TResult> &
    ReactiveSync<TParams, ReactiveSyncBox<TResult>>;
