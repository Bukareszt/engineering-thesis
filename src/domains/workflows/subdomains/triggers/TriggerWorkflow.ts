import { TriggersRepository } from './TriggersRepository';
import { ExecuteNode } from '../../commands/ExecuteNode';
import { GetWorkflow } from '../../commands/GetWorkflow';

export type TriggerWorkflow = (triggerId: string) => Promise<void>;
export const triggerWorkflow =
  (
    triggersRepository: TriggersRepository,
    getWorkflow: GetWorkflow,
    executeNode: ExecuteNode
  ): TriggerWorkflow =>
  async (triggerId: string) => {
    const trigger = await triggersRepository.get(triggerId);
    if (!trigger) {
      throw new Error('Trigger not found');
    }

    const workflow = await getWorkflow(trigger.workflowId);

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const node = workflow.getById(trigger.nodeId);

    if (!node) {
      throw new Error('Node not found');
    }

    await executeNode(node);
  };
