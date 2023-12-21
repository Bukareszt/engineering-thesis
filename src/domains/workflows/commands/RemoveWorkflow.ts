import { WorkflowRepository } from '../ports/WorkflowRepository';

export type RemoveWorkflow = (id: string) => Promise<void>;
export const removeWorkflow =
  (workflowRepository: WorkflowRepository): RemoveWorkflow =>
  async (id: string): Promise<void> => {
    await workflowRepository.remove(id);
  };
