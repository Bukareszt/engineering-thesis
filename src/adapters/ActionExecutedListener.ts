import { FinishNodeExecution } from '../domains/workflows/commands/FinishNodeExecution';
import { ExecutableAction } from '../domains/workflows/subdomains/executableActions/ExecutableAction';
import myEmitter from '../globals';

export const startInMemoryActionExecutedListener = (
  finishNodeExecution: FinishNodeExecution
) => {
  myEmitter.on(
    'actionExecuted',
    async (action: ExecutableAction & { executionId: string }) => {
      console.log(`Action ${action} was executed`);
      await finishNodeExecution(action.executionId);
    }
  );
};
