import 'immer';
import { ReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { create } from 'zustand';

export type ReviewedTodoRecord = {
  id: string;
  lastReviewedAt: string;
};

export type ReviewedTodoDict = {
  [key: string]: ReviewedTodoRecord | undefined;
};

const initialState: ReviewedTodoDict = {};

const toRecord = (reviewedTodo: ReviewedTodo): ReviewedTodoRecord => ({
  id: reviewedTodo.id,
  lastReviewedAt: reviewedTodo.lastReviewedAt.toISOString(),
});

export type ReviewedTodoStore = {
  dict: ReviewedTodoDict;
  saveReviewedTodo: (todo: ReviewedTodo) => void;
  saveManyReviewedTodos: (todoDictionary: ReviewedTodo[]) => void;
  deleteReviewedTodo: (args: { id: string }) => void;
  deleteAllTodos: () => void;
};

export const useReviewedTodoStore = create<ReviewedTodoStore>((set) => ({
  dict: initialState,
  saveReviewedTodo: (todo: ReviewedTodo) =>
    set((state) => ({
      dict: {
        ...state.dict,
        [todo.id]: toRecord(todo),
      },
    })),
  saveManyReviewedTodos: (todoDictionary: ReviewedTodo[]) =>
    set((state) => ({
      dict: {
        ...state.dict,
        ...todoDictionary.reduce((acc, todo) => {
          acc[todo.id] = toRecord(todo);
          return acc;
        }, {} as ReviewedTodoDict),
      },
    })),
  deleteReviewedTodo: (args: { id: string }) =>
    set((state) => {
      const newDict = { ...state.dict };
      delete newDict[args.id];
      return { dict: newDict };
    }),
  deleteAllTodos: () =>
    set(() => ({
      dict: {},
    })),
}));
