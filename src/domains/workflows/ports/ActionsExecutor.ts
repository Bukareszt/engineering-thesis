import { WorkflowNode } from '../models/WorkflowNode';

export type ActionsExecutor = (
  executionId: string,
  workflowNode: WorkflowNode
) => Promise<void>;
