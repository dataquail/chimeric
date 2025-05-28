import { combineReducers } from '@reduxjs/toolkit';
import { activeTodosReducer } from 'src/core/infrastructure/services/ActiveTodoService/activeTodoStore';
import { reviewReducer } from 'src/core/infrastructure/repositories/ReviewRepository/reviewStore';
import { reviewedTodoReducer } from 'src/core/infrastructure/repositories/ReviewedTodoRepository/reviewedTodoStore';

export const todoReducer = combineReducers({
  activeTodos: activeTodosReducer,
  review: reviewReducer,
  reviewedTodo: reviewedTodoReducer,
});
