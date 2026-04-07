export class RtkQueryError extends Error {
  public readonly rtkError: unknown;

  constructor(rtkError: unknown) {
    const message =
      typeof rtkError === 'object' &&
      rtkError !== null &&
      'message' in rtkError
        ? String((rtkError as { message: unknown }).message)
        : 'RTK Query Error';
    super(message);
    this.name = 'RtkQueryError';
    this.rtkError = rtkError;
  }
}

export function wrapRtkError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new RtkQueryError(error);
}
