import { Trigger } from './Trigger';
import { TriggersRepository } from './TriggersRepository';

export type GetTriggers = () => Promise<Trigger[]>;
export const getTriggers = (
  triggersRepository: TriggersRepository
): GetTriggers => {
  return async () => {
    const triggers = await triggersRepository.getAll();
    return triggers;
  };
};
