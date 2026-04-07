import {
  DefineChimericMutation,
  DefineChimericQuery,
} from '@chimeric/rtk-query';
import { CreateTodoBody } from '../dtos/in/CreateTodoBody';
import { ActiveTodo } from '../entities/ActiveTodo';

export type IActiveTodoService = {
  getAll: DefineChimericQuery<() => Promise<ActiveTodo[]>>;
  getOneById: DefineChimericQuery<
    (args: { id: string }) => Promise<ActiveTodo | undefined>
  >;
  createOne: DefineChimericMutation<
    (body: CreateTodoBody) => Promise<{ id: string }>
  >;
  deleteOne: DefineChimericMutation<(args: { id: string }) => Promise<void>>;
  completeOne: DefineChimericMutation<(args: { id: string }) => Promise<void>>;
  uncompleteOne: DefineChimericMutation<
    (args: { id: string }) => Promise<{ id: string }>
  >;
};
