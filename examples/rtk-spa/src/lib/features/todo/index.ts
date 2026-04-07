import { combineReducers } from '@reduxjs/toolkit';
import { reviewReducer } from 'src/core/infrastructure/repositories/ReviewRepository/reviewStore';
import { reviewedTodoReducer } from 'src/core/infrastructure/repositories/ReviewedTodoRepository/reviewedTodoStore';

export const todoReducer = combineReducers({
  review: reviewReducer,
  reviewedTodo: reviewedTodoReducer,
});
