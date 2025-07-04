export const makeReactiveEagerAsyncWithoutParamsReturnsString = () => ({
  useEagerAsync: vi.fn(() => ({
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
  })),
});

export const makeReactiveEagerAsyncWithParamsReturnsString = () => ({
  useEagerAsync: vi.fn((args: { name: string }) => ({
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
  })),
});
