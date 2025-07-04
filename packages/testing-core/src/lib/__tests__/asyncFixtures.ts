export const makeReactiveAsyncWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    call: vi.fn(() => Promise.resolve('test')),
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
  }));

export const makeReactiveAsyncWithParamsReturnsString = () =>
  vi.fn(() => ({
    call: vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    ),
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'Hello John',
  }));
