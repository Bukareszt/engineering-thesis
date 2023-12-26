import { IdGenerator } from '../../../adapters/idGenerator';
import { User } from '../../users/models/User';
import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { ExecutableAction } from '../subdomains/executableActions/ExecutableAction';
import { GetExecutableAction } from '../subdomains/executableActions/commands/GetExecutableAction';
import { Trigger } from '../subdomains/triggers/Trigger';
import { isDAG } from './IsDAG';
export type WorkflowNodeDto = {
  readonly actionId: string;
  readonly id: string;
  readonly viewProps: {
    x: number;
    y: number;
  };
};

export type AddWorkflow = (
  name: string,
  edges: { from: WorkflowNodeDto; to: WorkflowNodeDto }[],
  user: User
) => Promise<string>;

export type WorkflowEdge = {
  from: {
    id: string;
    action: ExecutableAction;
    viewProps: { x: number; y: number };
  };
  to: {
    id: string;
    action: ExecutableAction;
    viewProps: { x: number; y: number };
  };
};

export function assertAllActionsAreDefined(
  edges: {
    from: {
      id: string;
      action: ExecutableAction | Trigger | undefined;
      viewProps: { x: number; y: number };
    };
    to: {
      id: string;
      action: ExecutableAction | undefined;
      viewProps: { x: number; y: number };
    };
  }[]
): asserts edges is WorkflowEdge[] {
  if (edges.some((edge) => !edge.from.action || !edge.to.action)) {
    throw new Error('Workflow must have valid actions');
  }
}
export const addWorkflow =
  (
    workflowRepository: WorkflowRepository,
    getExecutableAction: GetExecutableAction,
    getTrigger: (id: string) => Promise<Trigger | undefined>,
    idGenerator: IdGenerator
  ): AddWorkflow =>
  async (
    name: string,
    edgesDto: { from: WorkflowNodeDto; to: WorkflowNodeDto }[],
    user: User
  ): Promise<string> => {
    const workflow = Workflow(name, idGenerator(), user.id);
    const edges = await Promise.all(
      edgesDto.map(async (edge) => ({
        from: {
          id: edge.from.id,
          action:
            (await getExecutableAction(edge.from.actionId)) ||
            (await getTrigger(edge.from.actionId)),
          viewProps: edge.from.viewProps
        },
        to: {
          id: edge.to.id,
          action: await getExecutableAction(edge.to.actionId),
          viewProps: edge.to.viewProps
        }
      }))
    );

    assertAllActionsAreDefined(edges);

    if (!isDAG(edges.map((edge) => ({ from: edge.from.id, to: edge.to.id })))) {
      throw new Error('Workflow must not contain cycles.');
    }

    edges.forEach((edge) =>
      workflow.addEdge(
        {
          ...edge.from,
          workflowId: workflow.id
        },
        {
          ...edge.to,
          workflowId: workflow.id
        }
      )
    );
    await workflowRepository.save(workflow);
    return workflow.id;
  };
