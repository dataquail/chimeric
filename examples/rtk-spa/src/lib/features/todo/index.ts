import { combineReducers } from '@reduxjs/toolkit';
import { reviewReducer } from 'src/core/infrastructure/repositories/ReviewRepository/reviewStore';
import { priorityTodoReducer } from 'src/core/infrastructure/repositories/PriorityTodoRepository/priorityTodoStore';

export const todoReducer = combineReducers({
  review: reviewReducer,
  priorityTodo: priorityTodoReducer,
});
