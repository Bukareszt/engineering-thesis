import { Router } from 'express';
import { z } from 'zod';
import { WorkflowsModule } from '../domains/workflows/workflowsModule';

const addWorkflowInput = z.object({
  name: z.string(),
  edges: z.array(
    z.object({
      from: z.object({
        id: z.string(),
        actionId: z.string()
      }),
      to: z.object({
        id: z.string(),
        actionId: z.string()
      })
    })
  )
});
export const workflowsRouter = ({
  workflowsModule
}: {
  workflowsModule: WorkflowsModule;
}) => {
  const router = Router();

  router.get('/', async (req, res) => {
    const result = await workflowsModule.getAll();
    res.send(result);
  });

  router.post('/', async (req, res) => {
    const reqBody = addWorkflowInput.parse(req.body);
    const id = await workflowsModule.addWorkflow(reqBody.name, reqBody.edges);
    res.send(id);
  });

  router.post('/executed/:id', async (req, res) => {
    const id = req.params.id;
    await workflowsModule.finishNodeExecution(id);
    res.sendStatus(204);
  });

  return router;
};
