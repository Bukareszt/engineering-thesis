import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export type GetWorkflows = () => Promise<Workflow[]>;
export const getWorkflows = (workflowRepository: WorkflowRepository) => () => {
  return workflowRepository.getAll();
};
