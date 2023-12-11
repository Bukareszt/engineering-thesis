import { Trigger } from './Trigger';

export interface TriggersRepository {
  save(trigger: Trigger): Promise<void>;
  get(id: string): Promise<Trigger | undefined>;
  getAll(): Promise<Trigger[]>;
}

export const inMemoryTriggersRepository = () => {
  const db = new Map<string, Trigger>();

  const save = (trigger: Trigger) => {
    db.set(trigger.id, trigger);
    return Promise.resolve();
  };

  const get = (id: string) => {
    return Promise.resolve(db.get(id));
  };

  const getAll = () => {
    return Promise.resolve(Array.from(db.values()));
  };

  const clear = () => {
    db.clear();
  };

  return {
    save,
    get,
    getAll,
    clear
  };
};
