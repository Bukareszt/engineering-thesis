import { Router } from 'express';
import { z } from 'zod';
import { UsersModule } from '../domains/users/usersModule';
import { WorkflowsModule } from '../domains/workflows/workflowsModule';
import authenticateToken from './middlewares/authorizationMiddleware';

const addWorkflowInput = z.object({
  name: z.string(),
  edges: z.array(
    z.object({
      from: z.object({
        id: z.string(),
        actionId: z.string(),
        viewProps: z.object({
          x: z.number(),
          y: z.number()
        })
      }),
      to: z.object({
        id: z.string(),
        actionId: z.string(),
        viewProps: z.object({
          x: z.number(),
          y: z.number()
        })
      })
    })
  )
});
export const workflowsRouter = ({
  workflowsModule,
  usersModule
}: {
  workflowsModule: WorkflowsModule;
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

    const result = await workflowsModule.getAll(user);
    res.send(result);
  });

  router.get('/:id', authenticateToken, async (req, res) => {
    const result = await workflowsModule.getWorkflow(req.params.id);
    res.send(
      result
        ? {
            name: result.name,
            id: result.id,
            edges: result.getEdges(),
            nodes: result.getNodes()
          }
        : undefined
    );
  });

  router.patch('/:id', authenticateToken, async (req, res) => {
    //@ts-ignore
    const username = req.username;

    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    const reqBody = addWorkflowInput.parse(req.body);
    const id = await workflowsModule.editWorkflow(
      req.params.id,
      reqBody.name,
      reqBody.edges,
      user
    );
    res.send(id);
  });

  router.post('/', authenticateToken, async (req, res) => {
    const reqBody = addWorkflowInput.parse(req.body);

    //@ts-ignore
    const username = req.username;
    const user = await usersModule.getByUsername(username);
    if (!user) {
      res.sendStatus(403);
      return;
    }

    const id = await workflowsModule.addWorkflow(
      reqBody.name,
      reqBody.edges,
      user
    );
    res.send(id);
  });

  router.post('/executed/:id', async (req, res) => {
    const id = req.params.id;
    await workflowsModule.finishNodeExecution(id);
    res.sendStatus(204);
  });

  router.delete('/:id', authenticateToken, async (req, res) => {
    await workflowsModule.removeWorkflow(req.params.id);
    res.sendStatus(204);
  });

  return router;
};
