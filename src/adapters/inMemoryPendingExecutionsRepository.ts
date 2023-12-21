import { PendingExecution } from '../domains/workflows/models/PendingExecution';
import { PendingExecutionsRepository } from '../domains/workflows/ports/PendingExecutionsRepository';

export const inMemoryPendingExecutionsRepository =
  (): PendingExecutionsRepository => {
    const pendingActions: Map<string, PendingExecution> = new Map();

    const save = (pendingAction: PendingExecution) => {
      pendingActions.set(pendingAction.id, pendingAction);
      return Promise.resolve();
    };

    const get = (id: string) => {
      return Promise.resolve(pendingActions.get(id));
    };

    return {
      save,
      get
    };
  };
