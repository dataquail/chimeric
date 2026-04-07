import { combineReducers } from '@reduxjs/toolkit';
import { reviewReducer } from '@/core/infrastructure/repositories/ReviewRepository/reviewStore';

export const todoReducer = combineReducers({
  review: reviewReducer,
});
