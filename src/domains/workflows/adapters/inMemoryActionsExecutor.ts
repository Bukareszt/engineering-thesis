import myEmitter from '../../../globals';

import { WorkflowNode } from '../models/WorkflowNode';
import { ActionsExecutor } from '../ports/ActionsExecutor';
import { PendingExecutionsRepository } from '../ports/PendingExecutionsRepository';

export const inMemoryActionsExecutor = (
  pendingExecutionsRepository: PendingExecutionsRepository
): ActionsExecutor => {
  const sendToExecution = async (
    executionId: string,
    workflowNode: WorkflowNode
  ) => {
    await pendingExecutionsRepository.save({
      id: executionId,
      status: 'pending',
      workflowNode
    });

    myEmitter.emit('actionExecuted', {
      ...workflowNode.action,
      executionId
    });

    await pendingExecutionsRepository.save({
      id: executionId,
      status: 'send',
      workflowNode
    });
  };

  return {
    sendToExecution
  };
};
