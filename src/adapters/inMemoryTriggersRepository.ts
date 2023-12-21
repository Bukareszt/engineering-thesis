import { Trigger } from '../domains/workflows/subdomains/triggers/Trigger';

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

  const remove = async (id: string) => {
    await Promise.resolve(db.delete(id));
  };

  const clear = () => {
    db.clear();
  };

  return {
    save,
    get,
    getAll,
    clear,
    remove
  };
};
