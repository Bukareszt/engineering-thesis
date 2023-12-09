import { IdGenerator } from '../../../../adapters/idGenerator';
import { ActionsExecutor } from '../../ports/ActionsExecutor';
import { inMemoryExecutableActionsRepository } from './ExecutableActionsRepository';
import {
  GetExecutableAction,
  getExecutableActions
} from './GetExecutableAction';
import {
  RegisterExecutableAction,
  registerExecutableAction
} from './RegisterExecutableAction';

export type ExecutableActionsModule = {
  registerExecutableAction: RegisterExecutableAction;
  getExecutableAction: GetExecutableAction;
};
export const executableActionsModule = ({
  actionsExecutor,
  idGenerator
}: {
  actionsExecutor: ActionsExecutor;
  idGenerator: IdGenerator;
}): ExecutableActionsModule => {
  const repository = inMemoryExecutableActionsRepository();

  const registerExecutableActionCommand = registerExecutableAction(
    repository,
    actionsExecutor,
    idGenerator
  );
  const getExecutableActionsCommand = getExecutableActions(repository);

  return {
    getExecutableAction: getExecutableActionsCommand,
    registerExecutableAction: registerExecutableActionCommand
  };
};
