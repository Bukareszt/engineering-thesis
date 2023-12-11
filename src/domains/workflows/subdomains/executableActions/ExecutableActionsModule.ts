import { IdGenerator } from '../../../../adapters/idGenerator';
import { ActionsExecutor } from '../../ports/ActionsExecutor';
import { ExecutableActionsRepository } from './ExecutableActionsRepository';
import {
  GetAllExecutableActions,
  getAllExecutableActions
} from './GetAllExecutableActions';
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
  getAllActions: GetAllExecutableActions;
};
export const executableActionsModule = ({
  actionsExecutor,
  idGenerator,
  repository
}: {
  actionsExecutor: ActionsExecutor;
  idGenerator: IdGenerator;
  repository: ExecutableActionsRepository;
}): ExecutableActionsModule => {
  const registerExecutableActionCommand = registerExecutableAction(
    repository,
    actionsExecutor,
    idGenerator
  );
  const getExecutableActionsCommand = getExecutableActions(repository);

  const getAllActions = getAllExecutableActions(repository);

  return {
    getExecutableAction: getExecutableActionsCommand,
    registerExecutableAction: registerExecutableActionCommand,
    getAllActions
  };
};
