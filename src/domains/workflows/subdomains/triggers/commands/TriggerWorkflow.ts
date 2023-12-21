import { User } from '../../../../users/models/User';
import { ExecuteNode } from '../../../commands/ExecuteNode';
import { GetWorkflows } from '../../../commands/GetWorkflows';
import { WorkflowNode } from '../../../models/WorkflowNode';
import { GetTrigger } from './GetTrigger';

export type TriggerWorkflow = (triggerId: string, user: User) => Promise<void>;
export const triggerWorkflow =
  (
    getTrigger: GetTrigger,
    getWorkflows: GetWorkflows,
    executeNode: ExecuteNode
  ): TriggerWorkflow =>
  async (triggerId: string, user: User) => {
    const trigger = await getTrigger(triggerId);

    if (!trigger) {
      throw new Error('Trigger not found');
    }

    const workflows = await getWorkflows(user);

    const nodesToRun: WorkflowNode[] = workflows
      .map((workflow) => workflow.getByTriggerId(trigger.id))
      .flat();
    await Promise.all(nodesToRun.map(async (node) => await executeNode(node)));
  };
