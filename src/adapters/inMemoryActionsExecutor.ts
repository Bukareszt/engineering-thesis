import myEmitter from '../globals';

import { WorkflowNode } from '../domains/workflows/models/WorkflowNode';
import { ActionsExecutor } from '../domains/workflows/ports/ActionsExecutor';
import { PendingExecutionsRepository } from '../domains/workflows/ports/PendingExecutionsRepository';

export const inMemoryActionsExecutor =
  (pendingExecutionsRepository: PendingExecutionsRepository): ActionsExecutor =>
  async (executionId: string, workflowNode: WorkflowNode) => {
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
