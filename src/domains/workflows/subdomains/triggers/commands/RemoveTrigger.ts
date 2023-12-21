import { User } from '../../../../users/models/User';
import { GetWorkflows } from '../../../commands/GetWorkflows';
import { TriggersRepository } from '../ports/TriggersRepository';

export type RemoveTrigger = (id: string, user: User) => Promise<void>;

export const removeTrigger =
  ({
    getWorkflows,
    triggersRepository
  }: {
    getWorkflows: GetWorkflows;
    triggersRepository: TriggersRepository;
  }): RemoveTrigger =>
  async (id: string, user: User) => {
    const allWorkflows = await getWorkflows(user);
    const trigger = await triggersRepository.get(id);
    if (!trigger) {
      throw new Error(`Trigger with id ${id} not found`);
    }
    const allWorkflowsWithAction = allWorkflows.filter((workflow) =>
      workflow.getNodes().some((node) => node.action.id === trigger.id)
    );
    if (allWorkflowsWithAction.length > 0) {
      throw new Error(
        `Trigger with id ${id} is used by workflows ${allWorkflowsWithAction
          .map((workflow) => workflow.id)
          .join(', ')}`
      );
    }

    return triggersRepository.remove(id);
  };
