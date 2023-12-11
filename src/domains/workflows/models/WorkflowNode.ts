import { ExecutableAction } from '../subdomains/executableActions/ExecutableActionsRepository';
import { Trigger } from '../subdomains/triggers/Trigger';

export type WorkflowNode = {
  readonly id: string;
  readonly action: ExecutableAction | Trigger;
  readonly workflowId: string;
};
