import { IdGenerator } from '../../../../adapters/idGenerator';
import { ExecuteNode } from '../../commands/ExecuteNode';
import { GetWorkflows } from '../../commands/GetWorkflows';
import { AddTrigger, addTrigger } from './commands/AddTrigger';
import { GetTrigger, getTrigger } from './commands/GetTrigger';
import { GetTriggers, getTriggers } from './commands/GetTriggers';
import { RemoveTrigger, removeTrigger } from './commands/RemoveTrigger';
import { TriggerWorkflow, triggerWorkflow } from './commands/TriggerWorkflow';
import { TriggersRepository } from './ports/TriggersRepository';

export type TriggersModule = {
  readonly getTriggers: GetTriggers;
  readonly addTrigger: AddTrigger;
  readonly triggerWorkflow: TriggerWorkflow;
  readonly getTrigger: GetTrigger;
  readonly removeTrigger: RemoveTrigger;
};

export const triggersModule = ({
  idGenerator,
  executeNode,
  getAllWorkflows,
  repository
}: {
  idGenerator: IdGenerator;
  executeNode: ExecuteNode;
  getAllWorkflows: GetWorkflows;
  repository: TriggersRepository;
}): TriggersModule => {
  const getTriggerCommand = getTrigger(repository);
  const getTriggersCommand = getTriggers(repository);
  const triggerWorkflowCommand = triggerWorkflow(
    getTriggerCommand,
    getAllWorkflows,
    executeNode
  );

  const addTriggerCommand = addTrigger(repository, idGenerator);

  const removeTriggerCommand = removeTrigger({
    getWorkflows: getAllWorkflows,
    triggersRepository: repository
  });

  return {
    getTriggers: getTriggersCommand,
    addTrigger: addTriggerCommand,
    triggerWorkflow: triggerWorkflowCommand,
    getTrigger: getTriggerCommand,
    removeTrigger: removeTriggerCommand
  };
};
