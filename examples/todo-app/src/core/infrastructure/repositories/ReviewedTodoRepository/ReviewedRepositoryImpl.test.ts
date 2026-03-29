import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'src/core/global/container';
import { createReviewedTodo } from 'src/core/domain/review/entities/ReviewedTodo';
import { useReviewedTodoStore } from './reviewedTodoStore';

describe('ReviewedTodoRepositoryImpl', () => {
  beforeEach(() => {
    useReviewedTodoStore.getState().deleteAllTodos();
  });

  const getReviewedTodoRepository = () => container.reviewedTodoRepository;

  it('getOneById', () => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const nonExistentReviewedTodo = reviewedTodoRepository.getOneById({
      id: 'some-id',
    });
    expect(nonExistentReviewedTodo).toBeUndefined();

    reviewedTodoRepository.save(createReviewedTodo('some-id'));

    const existentReviewedTodo = reviewedTodoRepository.getOneById({
      id: 'some-id',
    });
    expect(existentReviewedTodo).toBeDefined();
    expect(existentReviewedTodo?.id).toEqual('some-id');
  });

  it('saveMany', () => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    const nonExistentReviewedTodo1 = reviewedTodoRepository.getOneById({
      id: 'id-1',
    });
    const nonExistentReviewedTodo2 = reviewedTodoRepository.getOneById({
      id: 'id-2',
    });
    expect(nonExistentReviewedTodo1).toBeUndefined();
    expect(nonExistentReviewedTodo2).toBeUndefined();

    reviewedTodoRepository.saveMany([
      createReviewedTodo('id-1'),
      createReviewedTodo('id-2'),
    ]);

    const existentReviewedTodo1 = reviewedTodoRepository.getOneById({
      id: 'id-1',
    });
    const existentReviewedTodo2 = reviewedTodoRepository.getOneById({
      id: 'id-2',
    });
    expect(existentReviewedTodo1).toBeDefined();
    expect(existentReviewedTodo1?.id).toEqual('id-1');
    expect(existentReviewedTodo2).toBeDefined();
    expect(existentReviewedTodo2?.id).toEqual('id-2');
  });

  it('delete', () => {
    const reviewedTodoRepository = getReviewedTodoRepository();
    reviewedTodoRepository.save(createReviewedTodo('to-be-deleted-id'));

    const existentReviewedTodo = reviewedTodoRepository.getOneById({
      id: 'to-be-deleted-id',
    });
    expect(existentReviewedTodo).toBeDefined();
    expect(existentReviewedTodo?.id).toEqual('to-be-deleted-id');

    reviewedTodoRepository.delete({ id: 'to-be-deleted-id' });

    const deletedReviewedTodo = reviewedTodoRepository.getOneById({
      id: 'to-be-deleted-id',
    });
    expect(deletedReviewedTodo).toBeUndefined();
  });
});
