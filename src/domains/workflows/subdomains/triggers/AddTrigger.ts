import { IdGenerator } from '../../../../adapters/idGenerator';
import { TriggerDTO } from './Trigger';
import { TriggersRepository } from './TriggersRepository';

export type AddTrigger = (triggerDTO: TriggerDTO) => Promise<string>;
export const addTrigger =
  (
    triggersRepository: TriggersRepository,
    idGenerator: IdGenerator
  ): AddTrigger =>
  async (triggerDTO: TriggerDTO): Promise<string> => {
    const trigger = {
      ...triggerDTO,
      id: idGenerator()
    };
    await triggersRepository.save(trigger);
    return trigger.id;
  };
