import { PendingExecution } from '../models/PendingExecution';

export interface PendingExecutionsRepository {
  save(pendingAction: PendingExecution): Promise<void>;

  get(id: string): Promise<PendingExecution | undefined>;
}
