import { Container } from 'inversify';
import {
  DI_SYMBOLS,
  InjectionType,
  InjectionSymbol,
} from 'src/core/global/types';
// GLOBAL
import { AppStoreProviderImpl } from 'src/core/global/appStoreProvider/AppStoreProviderImpl';
import { QueryClientProviderImpl } from 'src/core/global/queryClientProvider/QueryClientProviderImpl';
import { ApplicationEventEmitterImpl } from 'src/core/global/ApplicationEventEmitter/ApplicationEventEmitterImpl';
// SERVICES
import { ActiveTodoServiceImpl } from 'src/core/infrastructure/services/ActiveTodoService/ActiveTodoServiceImpl';
import { SavedForLaterTodoServiceImpl } from 'src/core/infrastructure/services/SavedForLaterTodoService/SavedForLaterTodoServiceImpl';
// REPOSITORIES
import { ReviewRepositoryImpl } from 'src/core/infrastructure/repositories/ReviewRepository/ReviewRepositoryImpl';
import { ReviewedTodoRepositoryImpl } from 'src/core/infrastructure/repositories/ReviewedTodoRepository/ReviewedRepositoryImpl';
// USE CASES
import { StartReviewUseCase } from 'src/core/useCases/review/application/StartReviewUseCase';
import { FinishReviewUseCase } from 'src/core/useCases/review/application/FinishReviewUseCase';
import { GetTodosUnderReviewUseCase } from 'src/core/useCases/review/application/GetTodosUnderReviewUseCase';
import { HandleActiveTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleActiveTodoDelete';
import { HandleSavedForLaterTodoDelete } from 'src/core/useCases/review/eventHandlers/HandleSavedForLaterTodoDelete';

const getBindingArray = <
  K extends keyof typeof DI_SYMBOLS,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Impl extends new (...args: any[]) => InjectionType<K>,
>(
  symbol: K,
  impl: Impl,
) => {
  return [InjectionSymbol(symbol), impl] as const;
};

export const DI_CONFIG = {
  global: {
    DI_ARRAY: [
      getBindingArray('IAppStoreProvider', AppStoreProviderImpl),
      getBindingArray('IQueryClientProvider', QueryClientProviderImpl),
      getBindingArray('IApplicationEventEmitter', ApplicationEventEmitterImpl),
    ],
  },
  services: {
    DI_ARRAY: [
      getBindingArray('IActiveTodoService', ActiveTodoServiceImpl),
      getBindingArray(
        'ISavedForLaterTodoService',
        SavedForLaterTodoServiceImpl,
      ),
    ],
  },
  repositories: {
    DI_ARRAY: [
      getBindingArray('IReviewRepository', ReviewRepositoryImpl),
      getBindingArray('IReviewedTodoRepository', ReviewedTodoRepositoryImpl),
    ],
  },
  useCases: {
    DI_ARRAY: [
      getBindingArray('StartReviewUseCase', StartReviewUseCase),
      getBindingArray('FinishReviewUseCase', FinishReviewUseCase),
      getBindingArray('GetTodosUnderReviewUseCase', GetTodosUnderReviewUseCase),
      getBindingArray('HandleActiveTodoDelete', HandleActiveTodoDelete),
      getBindingArray(
        'HandleSavedForLaterTodoDelete',
        HandleSavedForLaterTodoDelete,
      ),
    ],
  },
};

// Eagerly instantiate event handlers
const EVENT_HANDLERS = [
  'HandleActiveTodoDelete',
  'HandleSavedForLaterTodoDelete',
  // Add other event handlers here
] as const;

export const registerAllEventHandlers = (appContainer: Container) =>
  EVENT_HANDLERS.forEach((handler) => {
    appContainer.get(InjectionSymbol(handler));
  });
