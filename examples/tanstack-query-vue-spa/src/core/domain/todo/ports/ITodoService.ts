import {
  DefineChimericMutation,
  DefineChimericQuery,
} from '@chimeric/vue-query';
import { Todo } from '../entities/Todo';

export type ITodoService = {
  getAll: DefineChimericQuery<() => Promise<Todo[]>, Error>;
  createOne: DefineChimericMutation<
    (body: { title: string }) => Promise<Todo>,
    Error
  >;
  deleteOne: DefineChimericMutation<
    (args: { id: string }) => Promise<void>,
    Error
  >;
  toggleOne: DefineChimericMutation<
    (args: { id: string }) => Promise<Todo>,
    Error
  >;
};
