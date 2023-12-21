import { Router } from 'express';
import { z } from 'zod';
import { UsersModule } from '../domains/users/usersModule';
import { TriggersModule } from '../domains/workflows/subdomains/triggers/TriggersModule';
import authenticateToken from './middlewares/authorizationMiddleware';

const TriggerInput = z.object({
  name: z.string(),
  description: z.string()
});

const ReleaseTrigger = z.object({
  id: z.string()
});

export const triggersRouter = ({
  triggersModule,
  usersModule
}: {
  triggersModule: TriggersModule;
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

    const triggers = await triggersModule.getTriggers(user);
    res.send(triggers);
  });

  router.post('/:id', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    const triggerParams = ReleaseTrigger.parse(req.params);
    await triggersModule.triggerWorkflow(triggerParams.id, user);
    res.sendStatus(204);
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    const triggerParams = ReleaseTrigger.parse(req.params);
    try {
      await triggersModule.removeTrigger(triggerParams.id, user);
      res.sendStatus(204);
    } catch (e: any) {
      if (e.message.includes('is used by workflows')) {
        res.status(409).json(e.message);
      }
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }
    const trigger = TriggerInput.parse(req.body);
    const id = await triggersModule.addTrigger(trigger, user);
    res.send(id);
  });

  return router;
};
