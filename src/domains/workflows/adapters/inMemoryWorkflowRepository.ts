import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';

export const inMemoryWorkflowRepository = (): WorkflowRepository => {
  const db = new Map<string, Workflow>();
  const save = (workflow: Workflow) => {
    db.set(workflow.id, workflow);
    return Promise.resolve();
  };

  const get = (id: string) => {
    return Promise.resolve(db.get(id));
  };

  const getAll = () => {
    return Promise.resolve(Array.from(db.values()));
  };

  return {
    save,
    get,
    getAll
  };
};
