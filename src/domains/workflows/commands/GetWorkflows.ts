import { WorkflowRepository } from '../ports/WorkflowRepository';

export type GetWorkflows = () => Promise<void>;
export const getWorkflows = (workflowRepository: WorkflowRepository) => () => {
  return workflowRepository.getAll();
};
