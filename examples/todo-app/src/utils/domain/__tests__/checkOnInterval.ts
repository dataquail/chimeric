export const checkOnInterval = async (
  checkFn: () => boolean,
  interval: number,
  timeout: number,
  resolve: () => void,
) => {
  const startTime = Date.now();
  const check = async () => {
    if (checkFn()) {
      resolve();
    } else if (Date.now() - startTime < timeout) {
      setTimeout(check, interval);
    }
  };
  check();
};
