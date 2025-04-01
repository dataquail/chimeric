import { fuseChimericRead } from '../Read';

describe('fuseChimericRead', () => {
  it('should invoke the idiomatic async function', () => {
    const mockIdiomaticRead = vi.fn(() => 'test');
    const mockReactiveRead = vi.fn(() => 'test');
    const testChimericRead = fuseChimericRead({
      idiomatic: mockIdiomaticRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericRead();
    expect(result).toEqual('test');
    expect(mockIdiomaticRead).toHaveBeenCalled();
    expect(mockReactiveRead).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', () => {
    const mockIdiomaticRead = vi.fn((name: string) => `Hello ${name}`);
    const mockReactiveRead = vi.fn((name: string) => `Hello ${name}`);
    const testChimericRead = fuseChimericRead({
      idiomatic: mockIdiomaticRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericRead('John');
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticRead).toHaveBeenCalledWith('John');
    expect(mockReactiveRead).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', () => {
    const mockIdiomaticRead = vi.fn(() => 'test');
    const mockReactiveRead = vi.fn(() => 'test');
    const testChimericRead = fuseChimericRead({
      idiomatic: mockIdiomaticRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericRead.use();
    expect(result).toEqual('test');
    expect(mockIdiomaticRead).not.toHaveBeenCalled();
    expect(mockReactiveRead).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', () => {
    const mockIdiomaticRead = vi.fn((name: string) => `Hello ${name}`);
    const mockReactiveRead = vi.fn((name: string) => `Hello ${name}`);
    const testChimericRead = fuseChimericRead({
      idiomatic: mockIdiomaticRead,
      reactive: mockReactiveRead,
    });
    const result = testChimericRead.use('John');
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticRead).not.toHaveBeenCalled();
    expect(mockReactiveRead).toHaveBeenCalledWith('John');
  });
});
