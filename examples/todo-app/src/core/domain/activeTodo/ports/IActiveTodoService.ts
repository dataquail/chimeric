import { ChimericMutationFactory } from 'src/utils/domain/ChimericMutation';
import { ChimericQueryFactory } from 'src/utils/domain/ChimericQuery';
import { CreateTodoBody } from '../dtos/in/CreateTodoBody';
import { ActiveTodo } from '../entities/ActiveTodo';

export type IActiveTodoService = {
  getAll: ChimericQueryFactory<() => Promise<ActiveTodo[]>, Error>;
  getOneById: ChimericQueryFactory<
    (args: { id: string }) => Promise<ActiveTodo | undefined>,
    Error
  >;
  createOne: ChimericMutationFactory<
    (body: CreateTodoBody) => Promise<{ id: string }>,
    Error
  >;
  deleteOne: ChimericMutationFactory<
    (args: { id: string }) => Promise<void>,
    Error
  >;
  completeOne: ChimericMutationFactory<
    (args: { id: string }) => Promise<void>,
    Error
  >;
  uncompleteOne: ChimericMutationFactory<
    (args: { id: string }) => Promise<void>,
    Error
  >;
  prioritize: (args: { id: string }) => void;
  deprioritize: (args: { id: string }) => void;
  clearAll: () => void;
};
