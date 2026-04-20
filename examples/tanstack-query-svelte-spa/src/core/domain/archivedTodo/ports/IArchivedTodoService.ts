import {
  DefineChimericMutation,
  DefineChimericInfiniteQuery,
} from '@chimeric/svelte-query';
import { ArchivedTodoPageDto } from '../dtos/out/ArchivedTodoPageDto';
import { ArchiveBody } from '../dtos/in/ArchiveBody';

export type IArchivedTodoService = {
  getAll: DefineChimericInfiniteQuery<
    () => Promise<ArchivedTodoPageDto>,
    ArchivedTodoPageDto,
    number,
    Error,
    string[]
  >;
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
