import {
  DefineChimericMutation,
  DefineChimericQuery,
} from '@chimeric/react-query';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';

export type ISavedForLaterTodoService = {
  getAll: DefineChimericQuery<() => Promise<SavedForLaterTodo[]>, Error>;
  getOneById: DefineChimericQuery<
    (args: { id: string }) => Promise<SavedForLaterTodo>,
    Error
  >;
  saveForLater: DefineChimericMutation<
    (body: SaveForLaterBody) => Promise<{ id: string }>,
    Error
  >;
  activate: DefineChimericMutation<
    (body: ActivateBody) => Promise<{ id: string }>,
    Error
  >;
  deleteOne: DefineChimericMutation<
    (args: { id: string }) => Promise<void>,
    Error
  >;
};
