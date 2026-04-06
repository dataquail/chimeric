const SERVER_ERROR_PREFIX = '@chimeric/react-query';

export function throwReactiveServerError(factoryName: string): never {
  throw new Error(
    `${SERVER_ERROR_PREFIX}: ${factoryName}() is not available in server components. ` +
      `It uses React hooks which cannot be called outside of client components.`,
  );
}

export function throwHookServerError(hookName: string): never {
  throw new Error(
    `${SERVER_ERROR_PREFIX}: ${hookName}() cannot be called in a server component. ` +
      `Hooks are only available in client components marked with 'use client'.`,
  );
}
