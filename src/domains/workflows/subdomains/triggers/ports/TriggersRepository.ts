import { Trigger } from '../Trigger';

export type TriggersRepository = {
  save(trigger: Trigger): Promise<void>;
  get(id: string): Promise<Trigger | undefined>;
  getAll(userId: string): Promise<Trigger[]>;
  remove(id: string): Promise<void>;
};
