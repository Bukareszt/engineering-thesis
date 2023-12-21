import { inMemoryUsersRepository } from './adapters/InMemoryUsersRepository';
import { idGenerator } from './adapters/idGenerator';
import { inMemoryTriggersRepository } from './adapters/inMemoryTriggersRepository';
import { inMemoryWorkflowRepository } from './adapters/inMemoryWorkflowRepository';
import { sqlTriggersRepository } from './adapters/sqlTriggersRepository';
import { sqlUsersRepository } from './adapters/sqlUsersRepository';
import { sqlWorkflowRepository } from './adapters/sqlWorkflowRepository';
import { bootstrap } from './app';
import { createDb } from './db/database';
import { usersModule } from './domains/users/usersModule';

import { startInMemoryActionExecutedListener } from './adapters/ActionExecutedListener';
import { httpActionsExecutor } from './adapters/httpActionsExecutor';
import { inMemoryActionsExecutor } from './adapters/inMemoryActionsExecutor';
import { inMemoryExecutableActionsRepository } from './adapters/inMemoryExecutableActionsRepository';
import { inMemoryPendingExecutionsRepository } from './adapters/inMemoryPendingExecutionsRepository';
import { sqlExecutableActionsRepository } from './adapters/sqlExecutableActionsRepository';
import { workflowsModule } from './domains/workflows/workflowsModule';

export const createInMemoryPorts = () => {
  const executableActionsRepository = inMemoryExecutableActionsRepository();
  const triggersRepository = inMemoryTriggersRepository();
  const workflowsRepository = inMemoryWorkflowRepository();
  const usersRepository = inMemoryUsersRepository();
  const pendingExecutionsRepository = inMemoryPendingExecutionsRepository();
  const actionsExecutor = inMemoryActionsExecutor(pendingExecutionsRepository);

  return {
    executableActionsRepository,
    triggersRepository,
    workflowsRepository,
    usersRepository,
    actionsExecutor,
    pendingExecutionsRepository
  };
};

const createLivePorts = () => {
  const db = createDb('postgres://postgres:postgres@localhost:5000/engine');
  const executableActionsRepository = sqlExecutableActionsRepository(db);
  const triggersRepository = sqlTriggersRepository(db);
  const workflowsRepository = sqlWorkflowRepository(db);
  const usersRepository = sqlUsersRepository(db);
  const pendingExecutionsRepository = inMemoryPendingExecutionsRepository();
  const actionsExecutor = httpActionsExecutor(pendingExecutionsRepository);
  return {
    executableActionsRepository,
    triggersRepository,
    workflowsRepository,
    usersRepository,
    actionsExecutor,
    pendingExecutionsRepository
  };
};
function start(runInMemory: boolean = false) {
  const {
    usersRepository,
    executableActionsRepository,
    triggersRepository,
    workflowsRepository,
    actionsExecutor,
    pendingExecutionsRepository
  } = runInMemory ? createInMemoryPorts() : createLivePorts();

  const workflowsMdl = workflowsModule({
    idGenerator,
    executableActionsRepository,
    triggersRepository,
    workflowsRepository,
    actionsExecutor,
    pendingExecutionsRepository
  });
  const usersMdl = usersModule({
    idGenerator,
    userRepository: usersRepository
  });

  runInMemory
    ? startInMemoryActionExecutedListener(
        workflowsMdl.workflowsModule.finishNodeExecution
      )
    : null;

  bootstrap({ ...workflowsMdl, usersModule: usersMdl });
}

start();
