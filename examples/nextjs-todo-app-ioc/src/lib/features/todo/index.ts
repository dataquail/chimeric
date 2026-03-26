import { combineReducers } from '@reduxjs/toolkit';
import { activeTodosReducer } from '@/core/infrastructure/services/ActiveTodoService/activeTodoStore';
import { reviewReducer } from '@/core/infrastructure/repositories/ReviewRepository/reviewStore';

export const todoReducer = combineReducers({
  activeTodos: activeTodosReducer,
  review: reviewReducer,
});
