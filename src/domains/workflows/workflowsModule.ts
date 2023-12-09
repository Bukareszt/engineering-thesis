import { IdGenerator } from '../../adapters/idGenerator';
import { inMemoryActionsExecutor } from './adapters/inMemoryActionsExecutor';
import { inMemoryPendingExecutionsRepository } from './adapters/inMemoryPendingExecutionsRepository';
import { inMemoryWorkflowRepository } from './adapters/inMemoryWorkflowRepository';
import { AddWorkflow, addWorkflow } from './commands/AddWorkflow';
import { executeNode } from './commands/ExecuteNode';
import {
  FinishNodeExecution,
  finishNodeExecution
} from './commands/FinishNodeExecution';
import { getWorkflow } from './commands/GetWorkflow';
import {
  ExecutableActionsModule,
  executableActionsModule
} from './subdomains/executableActions/ExecutableActionsModule';
import {
  TriggersModule,
  triggersModule
} from './subdomains/triggers/TriggersModule';

export type WorkflowsModule = {
  addWorkflow: AddWorkflow;
  finishNodeExecution: FinishNodeExecution;
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
  const actionsExecutor = inMemoryActionsExecutor(pendingActionsRepository);
  const executeNodeCommand = executeNode(actionsExecutor, idGenerator);
  const getWorkflowCommand = getWorkflow(workflowsRepository);

  const triggersMdl = triggersModule({
    idGenerator,
    getWorkflow: getWorkflowCommand,
    executeNode: executeNodeCommand
  });

  const executableActionsMdl = executableActionsModule({
    idGenerator,
    actionsExecutor
  });

  const addWorkflowCommand = addWorkflow(
    workflowsRepository,
    executableActionsMdl.getExecutableAction,
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
      finishNodeExecution: finishNodeExecutionCommand
    }
  };
};
