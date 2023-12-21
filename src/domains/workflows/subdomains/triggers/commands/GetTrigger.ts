import { Trigger } from '../Trigger';
import { TriggersRepository } from '../ports/TriggersRepository';

export type GetTrigger = (id: string) => Promise<Trigger | undefined>;
export const getTrigger =
  (triggersRepository: TriggersRepository): GetTrigger =>
  async (id: string) => {
    return await triggersRepository.get(id);
  };
