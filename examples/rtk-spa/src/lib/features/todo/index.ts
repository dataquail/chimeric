import { combineReducers } from '@reduxjs/toolkit';
import { reviewReducer } from 'src/core/infrastructure/repositories/ReviewRepository/reviewStore';

export const todoReducer = combineReducers({
  review: reviewReducer,
});
