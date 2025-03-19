// Globals
import { IAppStoreProvider } from './appStoreProvider/IAppStoreProvider';
import { IQueryClientProvider } from './queryClientProvider/IQueryClientProvider';
import { IApplicationEventEmitter } from './ApplicationEventEmitter/IApplicationEventEmitter';

// Services
import { IActiveTodoService } from '../domain/activeTodo/ports/IActiveTodoService';
import { ISavedForLaterTodoService } from '../domain/savedForLaterTodo/ports/ISavedForLaterTodoService';

// Repositories
import { IReviewedTodoRepository } from '../domain/review/ports/IReviewedTodoRepository';
import { IReviewRepository } from '../domain/review/ports/IReviewRepository';

// Use Cases
import { FinishReviewUseCase } from '../useCases/review/application/FinishReviewUseCase';
import { GetTodosUnderReviewUseCase } from '../useCases/review/application/GetTodosUnderReviewUseCase';
import { StartReviewUseCase } from '../useCases/review/application/StartReviewUseCase';
import { HandleActiveTodoDelete } from '../useCases/review/eventHandlers/HandleActiveTodoDelete';
import { HandleSavedForLaterTodoDelete } from '../useCases/review/eventHandlers/HandleSavedForLaterTodoDelete';

export const DI_SYMBOLS = {
  // Globals
  IAppStoreProvider: Symbol.for('IAppStoreProvider'),
  IQueryClientProvider: Symbol.for('IQueryClientProvider'),
  IApplicationEventEmitter: Symbol.for('IApplicationEventEmitter'),

  // Services
  IActiveTodoService: Symbol.for('IActiveTodoService'),
  ISavedForLaterTodoService: Symbol.for('ISavedForLaterTodoService'),

  // Repositories
  IReviewedTodoRepository: Symbol.for('IReviewedTodoRepository'),
  IReviewRepository: Symbol.for('IReviewRepository'),

  // Use Cases
  StartReviewUseCase: Symbol.for('StartReviewUseCase'),
  FinishReviewUseCase: Symbol.for('FinishReviewUseCase'),
  GetTodosUnderReviewUseCase: Symbol.for('GetTodosUnderReviewUseCase'),
  HandleActiveTodoDelete: Symbol.for('HandleActiveTodoDelete'),
  HandleSavedForLaterTodoDelete: Symbol.for('HandleSavedForLaterTodoDelete'),
};

export interface DI_RETURN_TYPES {
  // Globals
  IAppStoreProvider: IAppStoreProvider;
  IQueryClientProvider: IQueryClientProvider;
  IApplicationEventEmitter: IApplicationEventEmitter;

  // Services
  IActiveTodoService: IActiveTodoService;
  ISavedForLaterTodoService: ISavedForLaterTodoService;

  // Repositories
  IReviewedTodoRepository: IReviewedTodoRepository;
  IReviewRepository: IReviewRepository;

  // Use Cases
  StartReviewUseCase: StartReviewUseCase;
  FinishReviewUseCase: FinishReviewUseCase;
  GetTodosUnderReviewUseCase: GetTodosUnderReviewUseCase;
  HandleActiveTodoDelete: HandleActiveTodoDelete;
  HandleSavedForLaterTodoDelete: HandleSavedForLaterTodoDelete;
}

export function InjectionSymbol<K extends keyof typeof DI_SYMBOLS>(symbol: K) {
  return DI_SYMBOLS[symbol];
}

export type InjectionType<K extends keyof typeof DI_SYMBOLS> =
  DI_RETURN_TYPES[K];
