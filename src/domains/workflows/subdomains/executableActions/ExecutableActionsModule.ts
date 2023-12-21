import { IdGenerator } from '../../../../adapters/idGenerator';
import { GetWorkflows } from '../../commands/GetWorkflows';
import { ActionsExecutor } from '../../ports/ActionsExecutor';
import {
  GetAllExecutableActions,
  getAllExecutableActions
} from './commands/GetAllExecutableActions';
import {
  GetExecutableAction,
  getExecutableActions
} from './commands/GetExecutableAction';
import {
  RegisterExecutableAction,
  registerExecutableAction
} from './commands/RegisterExecutableAction';
import {
  RemoveExecutableAction,
  removeExecutableAction
} from './commands/RemoveExecutableAction';
import { ExecutableActionsRepository } from './ports/ExecutableActionsRepository';

export type ExecutableActionsModule = {
  registerExecutableAction: RegisterExecutableAction;
  getExecutableAction: GetExecutableAction;
  getAllActions: GetAllExecutableActions;
  removeExecutableAction: RemoveExecutableAction;
};
export const executableActionsModule = ({
  actionsExecutor,
  idGenerator,
  repository,
  getWorkflows
}: {
  actionsExecutor: ActionsExecutor;
  idGenerator: IdGenerator;
  repository: ExecutableActionsRepository;
  getWorkflows: GetWorkflows;
}): ExecutableActionsModule => {
  const registerExecutableActionCommand = registerExecutableAction(
    repository,
    actionsExecutor,
    idGenerator
  );
  const getExecutableActionsCommand = getExecutableActions(repository);

  const getAllActions = getAllExecutableActions(repository);

  const remove = removeExecutableAction(repository, getWorkflows);

  return {
    getExecutableAction: getExecutableActionsCommand,
    registerExecutableAction: registerExecutableActionCommand,
    getAllActions,
    removeExecutableAction: remove
  };
};
