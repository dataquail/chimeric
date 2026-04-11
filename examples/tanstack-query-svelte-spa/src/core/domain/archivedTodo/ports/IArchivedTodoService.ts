import {
  DefineChimericMutation,
  DefineChimericQuery,
} from '@chimeric/svelte-query';
import { ArchivedTodo } from '../entities/ArchivedTodo';
import { ArchiveBody } from '../dtos/in/ArchiveBody';

export type IArchivedTodoService = {
  getAll: DefineChimericQuery<() => Promise<ArchivedTodo[]>, Error, string[]>;
  archiveCompleted: DefineChimericMutation<
    (body: ArchiveBody) => Promise<{ ids: string[] }>,
    Error
  >;
  unarchiveOne: DefineChimericMutation<
    (args: { id: string }) => Promise<{ id: string }>,
    Error
  >;
  deleteOne: DefineChimericMutation<
    (args: { id: string }) => Promise<void>,
    Error
  >;
};
