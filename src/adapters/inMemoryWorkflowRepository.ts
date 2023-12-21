import { Workflow } from '../domains/workflows/models/Workflow';
import { WorkflowRepository } from '../domains/workflows/ports/WorkflowRepository';

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

  const remove = (id: string) => {
    db.delete(id);
    return Promise.resolve();
  };

  return {
    save,
    get,
    getAll,
    remove
  };
};
