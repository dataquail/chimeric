import { createReactiveRead } from '../Read';

describe('createReactiveRead', () => {
  it('should invoke the reactive function', () => {
    const mockReactiveRead = vi.fn(() => 'test');
    const testChimericRead = createReactiveRead(mockReactiveRead);
    const result = testChimericRead.use();
    expect(result).toEqual('test');
    expect(mockReactiveRead).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', () => {
    const mockReactiveRead = vi.fn((name: string) => `Hello ${name}`);
    const testChimericRead = createReactiveRead(mockReactiveRead);
    const result = testChimericRead.use('John');
    expect(result).toEqual('Hello John');
    expect(mockReactiveRead).toHaveBeenCalledWith('John');
  });
});
