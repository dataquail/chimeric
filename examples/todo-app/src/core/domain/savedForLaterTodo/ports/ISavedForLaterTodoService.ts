import { ChimericMutationFactory } from 'src/utils/domain/ChimericMutation';
import { ChimericQueryFactory } from 'src/utils/domain/ChimericQuery';
import { SavedForLaterTodo } from 'src/core/domain/savedForLaterTodo/entities/SavedForLaterTodo';
import { SaveForLaterBody } from 'src/core/domain/savedForLaterTodo/dtos/in/SaveForLaterBody';
import { ActivateBody } from 'src/core/domain/savedForLaterTodo/dtos/in/ActivateBody';

export type ISavedForLaterTodoService = {
  getAll: ChimericQueryFactory<() => Promise<SavedForLaterTodo[]>, Error>;
  getOneById: ChimericQueryFactory<
    (args: { id: string }) => Promise<SavedForLaterTodo>,
    Error
  >;
  saveForLater: ChimericMutationFactory<
    (body: SaveForLaterBody) => Promise<{ id: string }>,
    Error
  >;
  activate: ChimericMutationFactory<
    (body: ActivateBody) => Promise<{ id: string }>,
    Error
  >;
  deleteOne: ChimericMutationFactory<
    (args: { id: string }) => Promise<void>,
    Error
  >;
};
