import { IdGenerator } from '../../../../adapters/idGenerator';
import { ActionsExecutor } from '../../ports/ActionsExecutor';
import { ExecutableActionsRepository } from './ExecutableActionsRepository';

export type RegisterExecutableAction = (actionToRegister: {
  readonly address: string;
  readonly name: string;
}) => Promise<void>;

export const registerExecutableAction =
  (
    actionsRegister: ExecutableActionsRepository,
    actionsExecutor: ActionsExecutor,
    idGenerator: IdGenerator
  ): RegisterExecutableAction =>
  async (actionToRegister: {
    readonly address: string;
    readonly name: string;
  }) => {
    const existingAction = await actionsRegister.getByName(
      actionToRegister.name
    );

    if (existingAction) {
      return;
    }

    const executable = {
      ...actionToRegister,
      id: idGenerator.generate()
    };

    const executionId = idGenerator.generate();

    const workflowNode = {
      id: idGenerator.generate(),
      action: executable,
      workflowId: ''
    };

    await actionsExecutor.sendToExecution(executionId, workflowNode);

    await actionsRegister.applyAction(executable);
  };
