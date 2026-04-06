// Globals
import { AppStoreProviderImpl } from 'src/core/global/appStoreProvider/AppStoreProviderImpl';
import { QueryClientProviderImpl } from 'src/core/global/queryClientProvider/QueryClientProviderImpl';
import { ApplicationEventEmitterImpl } from 'src/core/global/ApplicationEventEmitter/ApplicationEventEmitterImpl';
// Services
import { createActiveTodoService } from 'src/core/infrastructure/services/ActiveTodoService/ActiveTodoServiceImpl';
import { createSavedForLaterTodoService } from 'src/core/infrastructure/services/SavedForLaterTodoService/SavedForLaterTodoServiceImpl';
// Repositories
import { createReviewRepository } from 'src/core/infrastructure/repositories/ReviewRepository/ReviewRepositoryImpl';
import { createReviewedTodoRepository } from 'src/core/infrastructure/repositories/ReviewedTodoRepository/ReviewedRepositoryImpl';
import { createPriorityTodoRepository } from 'src/core/infrastructure/repositories/PriorityTodoRepository/PriorityTodoRepositoryImpl';
// Use Cases
import { createStartReviewUseCase } from 'src/core/useCases/review/application/StartReviewUseCase';
import { createFinishReviewUseCase } from 'src/core/useCases/review/application/FinishReviewUseCase';
import { createGetTodosUnderReviewUseCase } from 'src/core/useCases/review/application/GetTodosUnderReviewUseCase';
import { createPrioritizeTodoUseCase } from 'src/core/useCases/activeTodo/application/PrioritizeTodoUseCase';
import { createDeprioritizeTodoUseCase } from 'src/core/useCases/activeTodo/application/DeprioritizeTodoUseCase';
// Event Handlers
import { createHandleActiveTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleActiveTodoDelete';
import { createHandleSavedForLaterTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleSavedForLaterTodoDelete';
import { createHandleActiveTodosFetched } from 'src/core/useCases/activeTodo/eventHandlers/HandleActiveTodosFetched';

// 1. Singletons
const appStoreProvider = new AppStoreProviderImpl();
const queryClientProvider = new QueryClientProviderImpl();
const applicationEventEmitter = new ApplicationEventEmitterImpl();

// 2. Repositories
const reviewRepository = createReviewRepository(appStoreProvider);
const reviewedTodoRepository = createReviewedTodoRepository();
const priorityTodoRepository = createPriorityTodoRepository();

// 3. Services
const activeTodoService = createActiveTodoService(
  queryClientProvider,
  applicationEventEmitter,
);
const savedForLaterTodoService = createSavedForLaterTodoService(
  queryClientProvider,
  applicationEventEmitter,
);

// 4. Use Cases
const startReviewUseCase = createStartReviewUseCase(
  reviewRepository,
  activeTodoService,
  savedForLaterTodoService,
);
const finishReviewUseCase = createFinishReviewUseCase(
  reviewRepository,
  reviewedTodoRepository,
);
const getTodosUnderReviewUseCase = createGetTodosUnderReviewUseCase(
  reviewRepository,
  reviewedTodoRepository,
  activeTodoService,
  savedForLaterTodoService,
);
const prioritizeTodoUseCase = createPrioritizeTodoUseCase(
  priorityTodoRepository,
);
const deprioritizeTodoUseCase = createDeprioritizeTodoUseCase(
  priorityTodoRepository,
);

// 5. Event Handlers (eagerly registered)
createHandleActiveTodoDelete(
  reviewRepository,
  reviewedTodoRepository,
  applicationEventEmitter,
);
createHandleSavedForLaterTodoDelete(
  reviewRepository,
  reviewedTodoRepository,
  applicationEventEmitter,
);
createHandleActiveTodosFetched(
  priorityTodoRepository,
  applicationEventEmitter,
);

export const container = {
  appStoreProvider,
  queryClientProvider,
  applicationEventEmitter,
  activeTodoService,
  savedForLaterTodoService,
  priorityTodoRepository,
  prioritizeTodoUseCase,
  deprioritizeTodoUseCase,
  reviewRepository,
  reviewedTodoRepository,
  startReviewUseCase,
  finishReviewUseCase,
  getTodosUnderReviewUseCase,
};
