/**
 * Executes an async function with retry capabilities and exponential backoff
 */
export const executeWithRetry = async <TResult>(
  asyncOperation: () => Promise<TResult>,
  retryCount?: number,
  initialAttempt = 0,
  lastError?: Error,
): Promise<TResult> => {
  try {
    return await asyncOperation();
  } catch (error) {
    if (retryCount === undefined) {
      throw error;
    }

    if (retryCount !== undefined && initialAttempt + 1 >= retryCount) {
      throw lastError || new Error('Max retry attempts reached');
    } else {
      // Exponential backoff: 2^attemptCount * 100ms (100, 200, 400, 800, 1600, ...)
      const delayMs = Math.min(2 ** initialAttempt * 100, 30000); // Cap at 30 seconds
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      return executeWithRetry(
        asyncOperation,
        retryCount,
        initialAttempt + 1,
        error as Error,
      );
    }
  }
};
