export const makeAsyncFnWithParamsReturnsString = () =>
  vi.fn(async (params: { name: string }) => `Hello ${params.name}`);

export const makeAsyncFnWithoutParamsReturnsString = () =>
  vi.fn(async () => 'test');

export const makeAsyncFnWithParamsReturnsObj = () =>
  vi.fn(async (params: { name: string }) => ({ name: params.name }));

export const makeAsyncFnWithOptionalParamsReturnsString = () =>
  vi.fn(async (params?: { name: string }) =>
    params?.name ? `Hello ${params.name}` : 'Hello',
  );

export const makeAsyncFnWithoutParamsReturnsObj = () =>
  vi.fn(async () => ({
    name: 'test',
  }));
