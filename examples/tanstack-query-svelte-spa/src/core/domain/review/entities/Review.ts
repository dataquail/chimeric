export type Review = {
  createdAt: Date;
  todoIdList: string[];
};

export function createReview(todoIdList: string[]): Review {
  return {
    createdAt: new Date(),
    todoIdList,
  };
}
