import { IdGenerator } from '../../adapters/idGenerator';
import { httpActionsExecutor } from './adapters/httpActionsExecutor';
import { inMemoryPendingExecutionsRepository } from './adapters/inMemoryPendingExecutionsRepository';
import { inMemoryWorkflowRepository } from './adapters/inMemoryWorkflowRepository';
import { AddWorkflow, addWorkflow } from './commands/AddWorkflow';
import { executeNode } from './commands/ExecuteNode';
import {
  FinishNodeExecution,
  finishNodeExecution
} from './commands/FinishNodeExecution';
import { GetWorkflows, getWorkflows } from './commands/GetWorkflows';
import {
  ExecutableActionsModule,
  executableActionsModule
} from './subdomains/executableActions/ExecutableActionsModule';
import { inMemoryExecutableActionsRepository } from './subdomains/executableActions/ExecutableActionsRepository';
import {
  TriggersModule,
  triggersModule
} from './subdomains/triggers/TriggersModule';
import { inMemoryTriggersRepository } from './subdomains/triggers/TriggersRepository';

export type WorkflowsModule = {
  addWorkflow: AddWorkflow;
  finishNodeExecution: FinishNodeExecution;
  getAll: GetWorkflows;
};

export const workflowsModule = ({
  idGenerator
}: {
  idGenerator: IdGenerator;
}): {
  executableActionsModule: ExecutableActionsModule;
  triggersModule: TriggersModule;
  workflowsModule: WorkflowsModule;
} => {
  const workflowsRepository = inMemoryWorkflowRepository();
  const pendingActionsRepository = inMemoryPendingExecutionsRepository();
  const actionsExecutor = httpActionsExecutor(pendingActionsRepository);
  const executeNodeCommand = executeNode(actionsExecutor, idGenerator);
  const getAllWorkflows = getWorkflows(workflowsRepository);

  const triggersMdl = triggersModule({
    idGenerator,
    getAllWorkflows,
    executeNode: executeNodeCommand,
    repository: inMemoryTriggersRepository()
  });

  const executableActionsMdl = executableActionsModule({
    idGenerator,
    actionsExecutor,
    repository: inMemoryExecutableActionsRepository()
  });

  const addWorkflowCommand = addWorkflow(
    workflowsRepository,
    executableActionsMdl.getExecutableAction,
    triggersMdl.getTrigger,
    idGenerator
  );
  const finishNodeExecutionCommand = finishNodeExecution(
    pendingActionsRepository,
    workflowsRepository,
    executeNodeCommand
  );

  return {
    executableActionsModule: executableActionsMdl,
    triggersModule: triggersMdl,
    workflowsModule: {
      addWorkflow: addWorkflowCommand,
      finishNodeExecution: finishNodeExecutionCommand,
      getAll: getAllWorkflows
    }
  };
};
