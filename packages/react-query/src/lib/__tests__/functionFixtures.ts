export const makeAsyncFnWithParamsReturnsString = () =>
  vi.fn(async (params: { name: string }) => `Hello ${params.name}`);

export const makeAsyncFnWithoutParamsReturnsString = () =>
  vi.fn(async () => 'test');

export const makeAsyncFnWithOptionalParamsReturnsString = () =>
  vi.fn(async (params?: { name: string }) =>
    params ? `Hello ${params?.name}` : 'Hello',
  );

export const makeAsyncFnWithParamsReturnsObj = () =>
  vi.fn(async (params: { name: string }) => ({ name: params.name }));

export const makeAsyncFnWithoutParamsReturnsObj = () =>
  vi.fn(async () => ({
    name: 'test',
  }));
