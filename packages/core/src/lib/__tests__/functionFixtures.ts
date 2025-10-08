export const makeAsyncFnWithParamsReturnsString = () =>
  vi.fn(async (params: { name: string }) => `Hello ${params.name}`);

export const makeAsyncFnWithoutParamsReturnsString = () =>
  vi.fn(async () => 'test');

export const makeAsyncFnWithParamsReturnsObj = () =>
  vi.fn(async (params: { name: string }) => ({ name: params.name }));

export const makeAsyncFnWithoutParamsReturnsObj = () =>
  vi.fn(async () => ({
    name: 'test',
  }));

export const makeSyncFnWithoutParamsReturnsString = () => vi.fn(() => 'test');

export const makeSyncFnWithParamsReturnsString = () =>
  vi.fn((params: { name: string }) => `Hello ${params.name}`);

export const makeSyncFnWithParamsReturnsObj = () =>
  vi.fn((params: { name: string }) => ({ name: params.name }));

export const makeSyncFnWithoutParamsReturnsObj = () =>
  vi.fn(() => ({
    name: 'test',
  }));

export const makeSyncFnWithOptionalParamsReturnsString = () =>
  vi.fn((params?: { name: string }) =>
    params && params.name ? `Hello ${params.name}` : 'Hello',
  );
