import { User } from '../../../../users/models/User';
import { Trigger } from '../Trigger';
import { TriggersRepository } from '../ports/TriggersRepository';

export type GetTriggers = (user: User) => Promise<Trigger[]>;
export const getTriggers = (
  triggersRepository: TriggersRepository
): GetTriggers => {
  return async (user: User) => {
    const triggers = await triggersRepository.getAll(user.id);
    return triggers;
  };
};
