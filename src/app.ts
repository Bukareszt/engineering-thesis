import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { ZodError } from 'zod';
import { executableActionsRouter } from './app/ExecutableActionsRouter';
import { triggersRouter } from './app/TriggersRouter';
import { workflowsRouter } from './app/WorkflowsRouter';
import { ExecutableActionsModule } from './domains/workflows/subdomains/executableActions/ExecutableActionsModule';
import { TriggersModule } from './domains/workflows/subdomains/triggers/TriggersModule';
import { WorkflowsModule } from './domains/workflows/workflowsModule';

export const bootstrap = ({
  workflowsModule,
  executableActionsModule,
  triggersModule
}: {
  workflowsModule: WorkflowsModule;
  executableActionsModule: ExecutableActionsModule;
  triggersModule: TriggersModule;
}) => {
  const app = express();
  const port = 3000;

  app.use(bodyParser.json());
  app.use('/triggers', triggersRouter({ triggersModule }));

  app.use(
    '/executable-actions',
    executableActionsRouter({ executableActionsModule })
  );

  app.use('/workflows', workflowsRouter({ workflowsModule }));

  app.use(handleErrors);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

const handleErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json(err.issues);
  }

  return res.status(500).json({ message: 'Internal server error' });
};
