export const makeAsyncFnWithParamsReturnsString = () =>
  vi.fn(async (params: { name: string }) => `Hello ${params.name}`);

export const makeAsyncFnWithoutParamsReturnsString = () =>
  vi.fn(
    async (_allOptions?: { options?: null; nativeOptions?: null }) => 'test',
  );

export const makeAsyncFnWithParamsReturnsObj = () =>
  vi.fn(async (params: { name: string }) => ({ name: params.name }));

export const makeAsyncFnWithoutParamsReturnsObj = () =>
  vi.fn(async (_allOptions?: { options?: null; nativeOptions?: null }) => ({
    name: 'test',
  }));

export const makeAsyncFnWithOptionalParamsReturnsString = () =>
  vi.fn(async (params?: { name: string }) =>
    params?.name ? `Hello ${params.name}` : 'Hello',
  );

export const makeSyncFnWithoutParamsReturnsString = () => vi.fn(() => 'test');

export const makeSyncFnWithParamsReturnsString = () =>
  vi.fn((params: { name: string }) => `Hello ${params.name}`);

export const makeSyncFnWithParamsReturnsObj = () =>
  vi.fn((params: { name: string }) => ({ name: params.name }));

export const makeSyncFnWithoutParamsReturnsObj = () =>
  vi.fn(() => ({
    name: 'test',
  }));
