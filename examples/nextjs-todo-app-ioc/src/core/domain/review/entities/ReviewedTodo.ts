export type ReviewedTodo = {
  id: string;
  lastReviewedAt: Date;
};

export const createReviewedTodo = (id: string): ReviewedTodo => ({
  id,
  lastReviewedAt: new Date(),
});
