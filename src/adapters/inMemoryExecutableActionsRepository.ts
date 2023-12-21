import { ExecutableAction } from '../domains/workflows/subdomains/executableActions/ExecutableAction';
import { ExecutableActionsRepository } from '../domains/workflows/subdomains/executableActions/ports/ExecutableActionsRepository';

export const inMemoryExecutableActionsRepository =
  (): ExecutableActionsRepository & {
    clear: () => void;
  } => {
    const actions: Map<string, ExecutableAction> = new Map();

    const applyAction = (action: ExecutableAction) => {
      actions.set(action.id, action);
      return Promise.resolve();
    };

    const get = (id: string) => {
      return Promise.resolve(actions.get(id));
    };

    const getAll = () => {
      return Promise.resolve(Array.from(actions.values()));
    };

    const remove = (id: string) => {
      actions.delete(id);
      return Promise.resolve();
    };

    const clear = () => {
      actions.clear();
    };

    return {
      applyAction,
      get,
      getAll,
      clear,
      remove
    };
  };
