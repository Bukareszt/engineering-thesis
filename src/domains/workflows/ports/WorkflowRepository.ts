import { Workflow } from '../models/Workflow';

export type WorkflowRepository = {
  save(workflow: Workflow): Promise<void>;
  get(id: string): Promise<Workflow | undefined>;
  getAll(): Promise<Workflow[]>;
};
