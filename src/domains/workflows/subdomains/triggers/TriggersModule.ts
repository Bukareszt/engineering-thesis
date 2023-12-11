import { IdGenerator } from '../../../../adapters/idGenerator';
import { ExecuteNode } from '../../commands/ExecuteNode';
import { GetWorkflows } from '../../commands/GetWorkflows';
import { AddTrigger, addTrigger } from './AddTrigger';
import { getTrigger } from './GetTrigger';
import { GetTriggers, getTriggers } from './GetTriggers';
import { Trigger } from './Trigger';
import { TriggerWorkflow, triggerWorkflow } from './TriggerWorkflow';
import { TriggersRepository } from './TriggersRepository';

export type TriggersModule = {
  readonly getTriggers: GetTriggers;
  readonly addTrigger: AddTrigger;
  readonly triggerWorkflow: TriggerWorkflow;
  readonly getTrigger: (id: string) => Promise<Trigger | undefined>;
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

  return {
    getTriggers: getTriggersCommand,
    addTrigger: addTriggerCommand,
    triggerWorkflow: triggerWorkflowCommand,
    getTrigger: getTriggerCommand
  };
};
