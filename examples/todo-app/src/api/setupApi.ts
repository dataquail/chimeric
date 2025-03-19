import { SetupWorker } from 'msw/browser';
import { ActiveTodoRepository } from './repositories/ActiveTodoRepository';
import { constructActiveTodoEndpointHandlers } from './constructActiveTodoEndpointHandlers';
import { SavedForLaterTodoRepository } from './repositories/SavedForLaterTodoRepository';
import { constructSavedForLaterTodoEndpointHandlers } from './constructSavedForLaterTodoEndpointHandlers';

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const setupApi = (worker: SetupWorker) => {
  const activeTodoRepository = new ActiveTodoRepository();
  const savedForLaterTodoRepository = new SavedForLaterTodoRepository();
  worker.use(
    ...constructActiveTodoEndpointHandlers(activeTodoRepository),
    ...constructSavedForLaterTodoEndpointHandlers(
      savedForLaterTodoRepository,
      activeTodoRepository,
    ),
  );

  return worker.start({
    serviceWorker: {
      url: './mockServiceWorker.js',
    },
  });
};
