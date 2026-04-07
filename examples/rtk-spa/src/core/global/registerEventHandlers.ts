import { handleActiveTodoDelete } from '../useCases/review/eventHandlers/handleActiveTodoDelete';
import { handleSavedForLaterTodoDelete } from '../useCases/review/eventHandlers/handleSavedForLaterTodoDelete';
import { handleActiveTodosFetched } from '../useCases/activeTodo/eventHandlers/handleActiveTodosFetched';
import { applicationEventEmitter } from './applicationEventEmitter';

const registerEventHandlers = () => {
  applicationEventEmitter.subscribe(handleActiveTodoDelete);
  applicationEventEmitter.subscribe(handleSavedForLaterTodoDelete);
  applicationEventEmitter.subscribe(handleActiveTodosFetched);
};

registerEventHandlers();
