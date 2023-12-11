import { IdGenerator } from '../../../adapters/idGenerator';
import { WorkflowNode } from '../models/WorkflowNode';
import { ActionsExecutor } from '../ports/ActionsExecutor';

export type ExecuteNode = (node: WorkflowNode) => Promise<void>;
export const executeNode =
  (actionsExecutor: ActionsExecutor, idGenerator: IdGenerator): ExecuteNode =>
  async (node: WorkflowNode) => {
    const executionId = idGenerator();
    await actionsExecutor(executionId, node);
  };
