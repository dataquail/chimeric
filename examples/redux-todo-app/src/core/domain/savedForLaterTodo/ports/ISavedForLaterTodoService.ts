import {
  DefineChimericMutation,
  DefineChimericQuery,
} from '@chimeric/rtk-query';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';

export type ISavedForLaterTodoService = {
  getAll: DefineChimericQuery<() => Promise<SavedForLaterTodo[]>>;
  getOneById: DefineChimericQuery<
    (args: { id: string }) => Promise<SavedForLaterTodo>
  >;
  saveForLater: DefineChimericMutation<
    (body: SaveForLaterBody) => Promise<{ id: string }>
  >;
  activate: DefineChimericMutation<
    (body: ActivateBody) => Promise<{ id: string }>
  >;
  deleteOne: DefineChimericMutation<(args: { id: string }) => Promise<void>>;
};
