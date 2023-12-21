import axios from 'axios';
import { WorkflowNode } from '../domains/workflows/models/WorkflowNode';
import { ActionsExecutor } from '../domains/workflows/ports/ActionsExecutor';
import { PendingExecutionsRepository } from '../domains/workflows/ports/PendingExecutionsRepository';

export const httpActionsExecutor =
  (pendingExecutionsRepository: PendingExecutionsRepository): ActionsExecutor =>
  async (executionId: string, workflowNode: WorkflowNode) => {
    if (!containsAddress(workflowNode.action)) {
      throw new Error('Action is not valid');
    }
    await pendingExecutionsRepository.save({
      id: executionId,
      status: 'pending',
      workflowNode
    });

    await axios.post(`${workflowNode.action.address}/execute/${executionId}`);

    await pendingExecutionsRepository.save({
      id: executionId,
      status: 'send',
      workflowNode
    });
  };

const containsAddress = (obj: unknown): obj is { address: string } => {
  return (obj as { address: string }).address !== undefined;
};
