export const validateMaxArgLength = (config: {
  fn: (...args: any[]) => any;
  fnName: string;
  maximumLength: number;
}) => {
  const { fn, fnName, maximumLength } = config;
  if (fn.length > maximumLength) {
    throw new Error(
      `${fnName} expected to have at most ${maximumLength} ${
        maximumLength === 1 ? 'argument' : 'arguments'
      }, but has ${fn.length}.`,
    );
  }
};
