import { RtkQueryError, wrapRtkError } from './wrapRtkError';

describe('wrapRtkError', () => {
  it('returns the error as-is if it is already an Error instance', () => {
    const error = new Error('already an error');
    expect(wrapRtkError(error)).toBe(error);
  });

  it('wraps a FetchBaseQueryError-like object in RtkQueryError', () => {
    const rtkError = { status: 500, data: { message: 'Server error' } };
    const wrapped = wrapRtkError(rtkError);
    expect(wrapped).toBeInstanceOf(RtkQueryError);
    expect(wrapped).toBeInstanceOf(Error);
    expect(wrapped.name).toBe('RtkQueryError');
    expect((wrapped as RtkQueryError).rtkError).toBe(rtkError);
  });

  it('wraps a SerializedError-like object and extracts message', () => {
    const rtkError = { message: 'Something went wrong', name: 'SerializedError' };
    const wrapped = wrapRtkError(rtkError);
    expect(wrapped).toBeInstanceOf(RtkQueryError);
    expect(wrapped.message).toBe('Something went wrong');
  });

  it('uses default message for non-object errors', () => {
    const wrapped = wrapRtkError('string error');
    expect(wrapped).toBeInstanceOf(RtkQueryError);
    expect(wrapped.message).toBe('RTK Query Error');
  });

  it('uses default message for null', () => {
    const wrapped = wrapRtkError(null);
    expect(wrapped).toBeInstanceOf(RtkQueryError);
    expect(wrapped.message).toBe('RTK Query Error');
  });
});
