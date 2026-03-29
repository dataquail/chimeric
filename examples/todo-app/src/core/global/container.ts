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
// Use Cases
import { createStartReviewUseCase } from 'src/core/useCases/review/application/StartReviewUseCase';
import { createFinishReviewUseCase } from 'src/core/useCases/review/application/FinishReviewUseCase';
import { createGetTodosUnderReviewUseCase } from 'src/core/useCases/review/application/GetTodosUnderReviewUseCase';
// Event Handlers
import { createHandleActiveTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleActiveTodoDelete';
import { createHandleSavedForLaterTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleSavedForLaterTodoDelete';

// 1. Singletons
const appStoreProvider = new AppStoreProviderImpl();
const queryClientProvider = new QueryClientProviderImpl();
const applicationEventEmitter = new ApplicationEventEmitterImpl();

// 2. Repositories
const reviewRepository = createReviewRepository(appStoreProvider);
const reviewedTodoRepository = createReviewedTodoRepository();

// 3. Services
const activeTodoService = createActiveTodoService(
  appStoreProvider,
  queryClientProvider,
  applicationEventEmitter,
);
const savedForLaterTodoService = createSavedForLaterTodoService(
  queryClientProvider,
  applicationEventEmitter,
  appStoreProvider,
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

export const container = {
  appStoreProvider,
  queryClientProvider,
  applicationEventEmitter,
  activeTodoService,
  savedForLaterTodoService,
  reviewRepository,
  reviewedTodoRepository,
  startReviewUseCase,
  finishReviewUseCase,
  getTodosUnderReviewUseCase,
};
