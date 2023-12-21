import { IdGenerator } from '../../adapters/idGenerator';
import { AddWorkflow, addWorkflow } from './commands/AddWorkflow';
import { EditWorkflow, editWorkflow } from './commands/EditWorkflow';
import { executeNode } from './commands/ExecuteNode';
import {
  FinishNodeExecution,
  finishNodeExecution
} from './commands/FinishNodeExecution';
import { GetWorkflow, getWorkflow } from './commands/GetWorkflow';
import { GetWorkflows, getWorkflows } from './commands/GetWorkflows';
import { RemoveWorkflow, removeWorkflow } from './commands/RemoveWorkflow';
import { ActionsExecutor } from './ports/ActionsExecutor';
import { PendingExecutionsRepository } from './ports/PendingExecutionsRepository';
import { WorkflowRepository } from './ports/WorkflowRepository';
import {
  ExecutableActionsModule,
  executableActionsModule
} from './subdomains/executableActions/ExecutableActionsModule';
import { ExecutableActionsRepository } from './subdomains/executableActions/ports/ExecutableActionsRepository';
import {
  TriggersModule,
  triggersModule
} from './subdomains/triggers/TriggersModule';
import { TriggersRepository } from './subdomains/triggers/ports/TriggersRepository';

export type WorkflowsModule = {
  addWorkflow: AddWorkflow;
  finishNodeExecution: FinishNodeExecution;
  getAll: GetWorkflows;
  getWorkflow: GetWorkflow;
  editWorkflow: EditWorkflow;
  removeWorkflow: RemoveWorkflow;
};

export const workflowsModule = ({
  idGenerator,
  executableActionsRepository,
  triggersRepository,
  workflowsRepository,
  actionsExecutor,
  pendingExecutionsRepository
}: {
  idGenerator: IdGenerator;
  executableActionsRepository: ExecutableActionsRepository;
  triggersRepository: TriggersRepository;
  workflowsRepository: WorkflowRepository;
  actionsExecutor: ActionsExecutor;
  pendingExecutionsRepository: PendingExecutionsRepository;
}): {
  executableActionsModule: ExecutableActionsModule;
  triggersModule: TriggersModule;
  workflowsModule: WorkflowsModule;
} => {
  const executeNodeCommand = executeNode(actionsExecutor, idGenerator);
  const getAllWorkflows = getWorkflows(workflowsRepository);

  const triggersMdl = triggersModule({
    idGenerator,
    getAllWorkflows,
    executeNode: executeNodeCommand,
    repository: triggersRepository
  });

  const executableActionsMdl = executableActionsModule({
    idGenerator,
    actionsExecutor,
    repository: executableActionsRepository,
    getWorkflows: getAllWorkflows
  });

  const addWorkflowCommand = addWorkflow(
    workflowsRepository,
    executableActionsMdl.getExecutableAction,
    triggersMdl.getTrigger,
    idGenerator
  );
  const finishNodeExecutionCommand = finishNodeExecution(
    pendingExecutionsRepository,
    workflowsRepository,
    executeNodeCommand
  );
  const editWorkflowCommand = editWorkflow(
    workflowsRepository,
    executableActionsMdl.getExecutableAction,
    triggersMdl.getTrigger
  );

  const removeWorkflowCommand = removeWorkflow(workflowsRepository);

  return {
    executableActionsModule: executableActionsMdl,
    triggersModule: triggersMdl,
    workflowsModule: {
      addWorkflow: addWorkflowCommand,
      finishNodeExecution: finishNodeExecutionCommand,
      getAll: getAllWorkflows,
      getWorkflow: getWorkflow(workflowsRepository),
      editWorkflow: editWorkflowCommand,
      removeWorkflow: removeWorkflowCommand
    }
  };
};
