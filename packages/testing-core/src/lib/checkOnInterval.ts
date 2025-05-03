export const checkOnInterval = async (
  checkFn: () => void,
  interval: number,
  timeout: number,
  resolve: () => void,
  reject: (error: Error) => void,
) => {
  const startTime = Date.now();
  const check = async () => {
    try {
      checkFn();
      resolve();
    } catch (error) {
      if (Date.now() - startTime < timeout) {
        setTimeout(check, interval);
      } else {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    }
  };
  check();
};
