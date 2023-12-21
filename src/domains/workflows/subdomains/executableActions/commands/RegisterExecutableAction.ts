import { IdGenerator } from '../../../../../adapters/idGenerator';
import { User } from '../../../../users/models/User';
import { ActionsExecutor } from '../../../ports/ActionsExecutor';
import { ExecutableActionsRepository } from '../ports/ExecutableActionsRepository';

export type RegisterExecutableAction = (
  actionToRegister: {
    readonly address: string;
    readonly name: string;
    readonly description: string;
  },
  user: User
) => Promise<string>;

export const registerExecutableAction =
  (
    actionsRegister: ExecutableActionsRepository,
    actionsExecutor: ActionsExecutor,
    idGenerator: IdGenerator
  ): RegisterExecutableAction =>
  async (
    actionToRegister: {
      readonly address: string;
      readonly name: string;
      readonly description: string;
    },
    user: User
  ) => {
    const executable = {
      ...actionToRegister,
      id: idGenerator(),
      userId: user.id
    };

    const executionId = idGenerator();

    const workflowNode = {
      id: idGenerator(),
      action: executable,
      workflowId: idGenerator(),
      viewProps: { x: 0, y: 0 }
    };

    await actionsExecutor(executionId, workflowNode);

    await actionsRegister.applyAction(executable);

    return executable.id;
  };
