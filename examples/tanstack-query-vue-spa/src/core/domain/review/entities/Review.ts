export type Review = {
  createdAt: Date;
  todoIdList: string[];
};

export const createReview = (todoIdList: string[]): Review => {
  if (new Set(todoIdList).size !== todoIdList.length) {
    throw new Error('todoIdList contains duplicates');
  }
  return {
    createdAt: new Date(),
    todoIdList,
  };
};
