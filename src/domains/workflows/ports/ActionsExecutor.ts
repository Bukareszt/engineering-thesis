import { WorkflowNode } from '../models/WorkflowNode';

export interface ActionsExecutor {
  sendToExecution(
    executionId: string,
    workflowNode: WorkflowNode
  ): Promise<void>;
}
