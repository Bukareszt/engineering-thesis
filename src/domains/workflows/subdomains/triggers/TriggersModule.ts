import { IdGenerator } from '../../../../adapters/idGenerator';
import { ExecuteNode } from '../../commands/ExecuteNode';
import { GetWorkflow } from '../../commands/GetWorkflow';
import { AddTrigger, addTrigger } from './AddTrigger';
import { GetTriggers, getTriggers } from './GetTriggers';
import { TriggerWorkflow, triggerWorkflow } from './TriggerWorkflow';
import { inMemoryTriggersRepository } from './TriggersRepository';

export type TriggersModule = {
  readonly getTriggers: GetTriggers;
  readonly addTrigger: AddTrigger;
  readonly triggerWorkflow: TriggerWorkflow;
};
export const triggersModule = ({
  idGenerator,
  getWorkflow,
  executeNode
}: {
  idGenerator: IdGenerator;
  getWorkflow: GetWorkflow;
  executeNode: ExecuteNode;
}): TriggersModule => {
  const repository = inMemoryTriggersRepository();

  const getTriggersCommand = getTriggers(repository);
  const addTriggerCommand = addTrigger(repository, getWorkflow, idGenerator);
  const triggerWorkflowCommand = triggerWorkflow(
    repository,
    getWorkflow,
    executeNode
  );

  return {
    getTriggers: getTriggersCommand,
    addTrigger: addTriggerCommand,
    triggerWorkflow: triggerWorkflowCommand
  };
};
