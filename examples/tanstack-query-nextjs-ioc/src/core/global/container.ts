import { cache } from 'react';
// Globals
import { AppStoreProviderImpl } from '@/core/global/appStoreProvider/AppStoreProviderImpl';
import { QueryClientProviderImpl } from '@/core/global/queryClientProvider/QueryClientProviderImpl';
import { ApplicationEventEmitterImpl } from '@/core/global/ApplicationEventEmitter/ApplicationEventEmitterImpl';
// Services
import { createActiveTodoService } from '@/core/infrastructure/services/ActiveTodoService/ActiveTodoServiceImpl';
import { createSavedForLaterTodoService } from '@/core/infrastructure/services/SavedForLaterTodoService/SavedForLaterTodoServiceImpl';
// Repositories
import { createReviewRepository } from '@/core/infrastructure/repositories/ReviewRepository/ReviewRepositoryImpl';
import { createReviewedTodoRepository } from '@/core/infrastructure/repositories/ReviewedTodoRepository/ReviewedRepositoryImpl';
import { createPriorityTodoRepository } from '@/core/infrastructure/repositories/PriorityTodoRepository/PriorityTodoRepositoryImpl';
// Use Cases
import { createStartReviewUseCase } from '@/core/useCases/review/application/StartReviewUseCase';
import { createFinishReviewUseCase } from '@/core/useCases/review/application/FinishReviewUseCase';
import { createGetTodosUnderReviewUseCase } from '@/core/useCases/review/application/GetTodosUnderReviewUseCase';
import { createPrioritizeTodoUseCase } from '@/core/useCases/activeTodo/application/PrioritizeTodoUseCase';
import { createDeprioritizeTodoUseCase } from '@/core/useCases/activeTodo/application/DeprioritizeTodoUseCase';
// Event Handlers
import { createHandleActiveTodoDelete } from '@/core/useCases/review/eventHandlers/HandleActiveTodoDelete';
import { createHandleSavedForLaterTodoDelete } from '@/core/useCases/review/eventHandlers/HandleSavedForLaterTodoDelete';
import { createHandleActiveTodosFetched } from '@/core/useCases/activeTodo/eventHandlers/HandleActiveTodosFetched';
// Event Deserializers
import { deserializeActiveTodoEvents } from '@/core/domain/activeTodo/events/deserializeActiveTodoEvents';

function createContainer() {
  // 1. Singletons (within this container instance)
  const appStoreProvider = new AppStoreProviderImpl();
  const queryClientProvider = new QueryClientProviderImpl();
  const applicationEventEmitter = new ApplicationEventEmitterImpl([
    deserializeActiveTodoEvents,
  ]);

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

  return {
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
}

// Server: per-request singleton via React cache()
// Each request gets its own container with ephemeral QueryClient and Redux store,
// preventing cross-user session leakage.
const getServerContainer = cache(createContainer);

// Client: module-level singleton
// The container persists for the lifetime of the browser tab.
let clientContainer: ReturnType<typeof createContainer> | undefined;
function getClientContainer() {
  if (!clientContainer) {
    clientContainer = createContainer();
  }
  return clientContainer;
}

export function getContainer() {
  if (typeof window === 'undefined') {
    return getServerContainer();
  }
  return getClientContainer();
}
