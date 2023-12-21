import { ExecutableAction } from '../subdomains/executableActions/ExecutableAction';
import { Trigger } from '../subdomains/triggers/Trigger';

export type WorkflowNode = {
  readonly id: string;
  readonly action: ExecutableAction | Trigger;
  readonly workflowId: string;
  readonly viewProps: {
    x: number;
    y: number;
  };
};
