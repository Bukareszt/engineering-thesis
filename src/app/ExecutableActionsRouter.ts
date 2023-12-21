import { Router } from 'express';
import { z } from 'zod';
import { UsersModule } from '../domains/users/usersModule';
import { ExecutableActionsModule } from '../domains/workflows/subdomains/executableActions/ExecutableActionsModule';
import authenticateToken from './middlewares/authorizationMiddleware';

const RegisterExecutableActionInput = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string()
});
export const executableActionsRouter = ({
  executableActionsModule,
  usersModule
}: {
  executableActionsModule: ExecutableActionsModule;
  usersModule: UsersModule;
}) => {
  const router = Router();

  router.get('/', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    const executableActions = await executableActionsModule.getAllActions(user);
    res.send(executableActions);
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    try {
      const { id } = req.params;
      await executableActionsModule.removeExecutableAction(id, user);
      res.sendStatus(204);
    } catch (e: any) {
      if (e.message.includes('is used by workflows')) {
        res.status(409).json(e.message);
      }
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    const executableActionDTO = RegisterExecutableActionInput.parse(req.body);
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    await executableActionsModule.registerExecutableAction(
      executableActionDTO,
      user
    );

    res.sendStatus(204);
  });

  return router;
};
