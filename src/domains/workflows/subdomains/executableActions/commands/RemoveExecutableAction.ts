import { User } from '../../../../users/models/User';
import { GetWorkflows } from '../../../commands/GetWorkflows';
import { ExecutableActionsRepository } from '../ports/ExecutableActionsRepository';

export type RemoveExecutableAction = (
  actionId: string,
  user: User
) => Promise<void>;

export const removeExecutableAction =
  (
    executableActionsRepository: ExecutableActionsRepository,
    getWorkflows: GetWorkflows
  ) =>
  async (actionId: string, user: User) => {
    const allWorkflows = await getWorkflows(user);
    const action = await executableActionsRepository.get(actionId);
    if (!action) {
      throw new Error(`Action with id ${actionId} not found`);
    }
    const allWorkflowsWithAction = allWorkflows.filter((workflow) =>
      workflow.getNodes().some((node) => node.action.id === actionId)
    );
    if (allWorkflowsWithAction.length > 0) {
      throw new Error(
        `Action with id ${actionId} is used by workflows ${allWorkflowsWithAction
          .map((workflow) => workflow.id)
          .join(', ')}`
      );
    }

    return executableActionsRepository.remove(actionId);
  };
