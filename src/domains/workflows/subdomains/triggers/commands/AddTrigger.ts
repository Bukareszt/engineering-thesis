import { IdGenerator } from '../../../../../adapters/idGenerator';
import { User } from '../../../../users/models/User';
import { Trigger, TriggerDTO } from '../Trigger';
import { TriggersRepository } from '../ports/TriggersRepository';

export type AddTrigger = (
  triggerDTO: TriggerDTO,
  user: User
) => Promise<string>;
export const addTrigger =
  (
    triggersRepository: TriggersRepository,
    idGenerator: IdGenerator
  ): AddTrigger =>
  async (triggerDTO: TriggerDTO, user: User): Promise<string> => {
    const trigger: Trigger = {
      ...triggerDTO,
      id: idGenerator(),
      userId: user.id
    };
    await triggersRepository.save(trigger);
    return trigger.id;
  };
