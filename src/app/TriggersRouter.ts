import { Router } from 'express';
import { z } from 'zod';
import { TriggersModule } from '../domains/workflows/subdomains/triggers/TriggersModule';

const TriggerInput = z.object({
  name: z.string(),
  type: z.enum(['webhook', 'timer']),
  workflowId: z.string(),
  nodeId: z.string()
});

const ReleaseTrigger = z.object({
  id: z.string()
});

export const triggersRouter = ({
  triggersModule
}: {
  triggersModule: TriggersModule;
}) => {
  const router = Router();

  router.get('/', async (req, res) => {
    const triggers = await triggersModule.getTriggers();
    res.send(triggers);
  });

  router.post('/:id', async (req, res) => {
    const triggerParams = ReleaseTrigger.parse(req.params);
    await triggersModule.triggerWorkflow(triggerParams.id);
    res.sendStatus(204);
  });

  router.post('/', async (req, res) => {
    const trigger = TriggerInput.parse(req.body);
    const id = await triggersModule.addTrigger(trigger);
    res.send(id);
  });

  return router;
};
