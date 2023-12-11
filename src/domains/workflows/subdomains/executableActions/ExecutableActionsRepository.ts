export type ExecutableAction = {
  readonly address: string;
  readonly name: string;
  readonly id: string;
  readonly description: string;
};

export interface ExecutableActionsRepository {
  applyAction(action: ExecutableAction): Promise<void>;
  get(id: string): Promise<ExecutableAction | undefined>;
  getByName(name: string): Promise<ExecutableAction | undefined>;
  getAll(): Promise<ExecutableAction[]>;
}

export const inMemoryExecutableActionsRepository = () => {
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

  const getByName = (name: string) => {
    return Promise.resolve(
      Array.from(actions.values()).find((action) => action.name === name)
    );
  };

  const clear = () => {
    actions.clear();
  };

  return {
    applyAction,
    get,
    getAll,
    getByName,
    clear
  };
};
