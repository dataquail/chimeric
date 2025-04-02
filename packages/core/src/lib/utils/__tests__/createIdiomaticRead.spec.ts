import { createIdiomaticRead } from '../Read';

describe('createIdiomaticRead', () => {
  it('should invoke the idiomatic async function', () => {
    const mockIdiomaticRead = vi.fn(() => 'test');
    const testChimericRead = createIdiomaticRead(mockIdiomaticRead);
    const result = testChimericRead();
    expect(result).toEqual('test');
    expect(mockIdiomaticRead).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', () => {
    const mockIdiomaticRead = vi.fn((name: string) => `Hello ${name}`);
    const testChimericRead = createIdiomaticRead(mockIdiomaticRead);
    const result = testChimericRead('John');
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticRead).toHaveBeenCalledWith('John');
  });
});
