export const idiomaticMethods = ['idiomatic'] as const;

export const reactiveMethods = ['reactive'] as const;

export const chimericMethods = ['idiomatic', 'reactive'] as const;

export type IdiomaticMethod = (typeof idiomaticMethods)[number];
export type ReactiveMethod = (typeof reactiveMethods)[number];
export type ChimericMethod = (typeof chimericMethods)[number];
