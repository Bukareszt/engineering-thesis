import { WorkflowRepository } from '../ports/WorkflowRepository';

import { PendingExecutionsRepository } from '../ports/PendingExecutionsRepository';
import { ExecuteNode } from './ExecuteNode';

export type FinishNodeExecution = (actionId: string) => Promise<void>;
export const finishNodeExecution =
  (
    pendingExecutionsRepository: PendingExecutionsRepository,
    workflowRepository: WorkflowRepository,
    executeNode: ExecuteNode
  ): FinishNodeExecution =>
  async (actionId: string) => {
    const pendingExecution = await pendingExecutionsRepository.get(actionId);

    if (!pendingExecution) {
      return;
    }

    const workflow = await workflowRepository.get(
      pendingExecution.workflowNode.workflowId
    );

    if (!workflow) {
      return;
    }

    await pendingExecutionsRepository.save({
      ...pendingExecution,
      status: 'executed'
    });
    const nextNodes = workflow.getNext(pendingExecution.workflowNode);
    await Promise.all(nextNodes.map(async (node) => await executeNode(node)));
  };
