import { Router } from 'express';
import { z } from 'zod';
import { ExecutableActionsModule } from '../domains/workflows/subdomains/executableActions/ExecutableActionsModule';

const RegisterExecutableActionInput = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string()
});
export const executableActionsRouter = ({
  executableActionsModule
}: {
  executableActionsModule: ExecutableActionsModule;
}) => {
  const router = Router();

  router.get('/', async (req, res) => {
    const executableActions = await executableActionsModule.getAllActions();
    res.send(executableActions);
  });

  router.post('/', async (req, res) => {
    const executableActionDTO = RegisterExecutableActionInput.parse(req.body);

    await executableActionsModule.registerExecutableAction(executableActionDTO);

    res.sendStatus(204);
  });

  return router;
};
