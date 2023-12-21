import { ExecutableAction } from '../ExecutableAction';

export type ExecutableActionsRepository = {
  applyAction(action: ExecutableAction): Promise<void>;
  get(id: string): Promise<ExecutableAction | undefined>;
  getAll(userId: string): Promise<ExecutableAction[]>;
  remove(id: string): Promise<void>;
};
