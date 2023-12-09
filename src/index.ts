import { idGenerator } from './adapters/idGenerator';
import { bootstrap } from './app';
import { workflowsModule } from './domains/workflows/workflowsModule';
import { startInMemoryActionExecutedListener } from './listeners/ActionExecutedListener';

function start() {
  const workflowsMdl = workflowsModule({ idGenerator });
  startInMemoryActionExecutedListener(
    workflowsMdl.workflowsModule.finishNodeExecution
  );
  bootstrap(workflowsMdl);
}

start();
