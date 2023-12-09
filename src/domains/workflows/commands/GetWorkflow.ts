import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export type GetWorkflow = (workflowId: string) => Promise<Workflow | undefined>;
export const getWorkflow =
  (workflowsRepository: WorkflowRepository): GetWorkflow =>
  async (workflowId: string) => {
    return workflowsRepository.get(workflowId);
  };
