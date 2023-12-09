import { WorkflowNode } from './WorkflowNode';

export type PendingExecution = {
  readonly id: string;
  readonly status: 'pending' | 'send' | 'executed';
  readonly workflowNode: WorkflowNode;
};
