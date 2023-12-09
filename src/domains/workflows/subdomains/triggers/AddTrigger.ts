import { IdGenerator } from '../../../../adapters/idGenerator';
import { GetWorkflow } from '../../commands/GetWorkflow';
import { TriggerDTO } from './Trigger';
import { TriggersRepository } from './TriggersRepository';

export type AddTrigger = (triggerDTO: TriggerDTO) => Promise<string>;
export const addTrigger =
  (
    triggersRepository: TriggersRepository,
    getWorkflow: GetWorkflow,
    idGenerator: IdGenerator
  ): AddTrigger =>
  async (triggerDTO: TriggerDTO): Promise<string> => {
    const workflow = await getWorkflow(triggerDTO.workflowId);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    const node = workflow.getById(triggerDTO.nodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    const trigger = {
      ...triggerDTO,
      id: idGenerator.generate()
    };
    await triggersRepository.save(trigger);
    return trigger.id;
  };
