import { User } from '../../users/models/User';
import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export type GetWorkflows = (user: User) => Promise<Workflow[]>;
export const getWorkflows =
  (workflowRepository: WorkflowRepository) => (user: User) => {
    return workflowRepository.getAll(user.id);
  };
