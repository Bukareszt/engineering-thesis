import { ExecutableAction } from '../subdomains/executableActions/ExecutableActionsRepository';

export type WorkflowNode = {
  readonly id: string;
  readonly action: ExecutableAction;
  readonly workflowId: string;
};
