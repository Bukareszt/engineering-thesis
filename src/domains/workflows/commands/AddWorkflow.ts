import { IdGenerator } from '../../../adapters/idGenerator';
import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { ExecutableAction } from '../subdomains/executableActions/ExecutableActionsRepository';
import { GetExecutableAction } from '../subdomains/executableActions/GetExecutableAction';
import { Trigger } from '../subdomains/triggers/Trigger';
import { isDAG } from './IsDAG';
type WorkflowNodeDto = {
  readonly actionId: string;
  readonly id: string;
};

export type AddWorkflow = (
  name: string,
  edges: { from: WorkflowNodeDto; to: WorkflowNodeDto }[]
) => Promise<string>;

type WorkflowEdge = {
  from: { id: string; action: ExecutableAction };
  to: { id: string; action: ExecutableAction };
};

function assertAllActionsAreDefined(
  edges: {
    from: { id: string; action: ExecutableAction | Trigger | undefined };
    to: { id: string; action: ExecutableAction | undefined };
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
    edgesDto: { from: WorkflowNodeDto; to: WorkflowNodeDto }[]
  ): Promise<string> => {
    const workflow = Workflow(name, idGenerator());
    const edges = await Promise.all(
      edgesDto.map(async (edge) => ({
        from: {
          id: edge.from.id,
          action:
            (await getExecutableAction(edge.from.actionId)) ||
            (await getTrigger(edge.from.actionId))
        },
        to: {
          id: edge.to.id,
          action: await getExecutableAction(edge.to.actionId)
        }
      }))
    );

    assertAllActionsAreDefined(edges);

    if (!isDAG(edges.map((edge) => ({ from: edge.from.id, to: edge.to.id })))) {
      throw new Error('Workflow must be DAG');
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
