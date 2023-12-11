import { IdGenerator } from '../../../../adapters/idGenerator';
import { ActionsExecutor } from '../../ports/ActionsExecutor';
import { ExecutableActionsRepository } from './ExecutableActionsRepository';

export type RegisterExecutableAction = (actionToRegister: {
  readonly address: string;
  readonly name: string;
  readonly description: string;
}) => Promise<string>;

export const registerExecutableAction =
  (
    actionsRegister: ExecutableActionsRepository,
    actionsExecutor: ActionsExecutor,
    idGenerator: IdGenerator
  ): RegisterExecutableAction =>
  async (actionToRegister: {
    readonly address: string;
    readonly name: string;
    readonly description: string;
  }) => {
    const executable = {
      ...actionToRegister,
      id: idGenerator()
    };

    const executionId = idGenerator();

    const workflowNode = {
      id: idGenerator(),
      action: executable,
      workflowId: ''
    };

    await actionsExecutor(executionId, workflowNode);

    await actionsRegister.applyAction(executable);

    return executable.id;
  };
