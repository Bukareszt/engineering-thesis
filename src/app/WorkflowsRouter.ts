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

  router.get('/', (req, res) => {});

  router.post('/', async (req, res) => {
    const reqBody = addWorkflowInput.parse(req.body);
    const id = await workflowsModule.addWorkflow(reqBody.name, reqBody.edges);
    res.send(id);
  });

  return router;
};
