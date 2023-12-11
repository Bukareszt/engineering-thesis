import { ExecuteNode } from '../../commands/ExecuteNode';
import { GetWorkflows } from '../../commands/GetWorkflows';
import { WorkflowNode } from '../../models/WorkflowNode';
import { GetTrigger } from './GetTrigger';

export type TriggerWorkflow = (triggerId: string) => Promise<void>;
export const triggerWorkflow =
  (
    getTrigger: GetTrigger,
    getWorkflows: GetWorkflows,
    executeNode: ExecuteNode
  ): TriggerWorkflow =>
  async (triggerId: string) => {
    const trigger = await getTrigger(triggerId);

    if (!trigger) {
      throw new Error('Trigger not found');
    }

    const workflows = await getWorkflows();

    const nodesToRun: WorkflowNode[] = workflows
      .map((workflow) => workflow.getByTriggerId(trigger.id))
      .flat();
    await Promise.all(nodesToRun.map(async (node) => await executeNode(node)));
  };
