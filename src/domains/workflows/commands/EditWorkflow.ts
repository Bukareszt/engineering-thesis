import { User } from '../../users/models/User';
import { Workflow } from '../models/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { GetExecutableAction } from '../subdomains/executableActions/commands/GetExecutableAction';
import { Trigger } from '../subdomains/triggers/Trigger';
import { assertAllActionsAreDefined, WorkflowNodeDto } from './AddWorkflow';
import { isDAG } from './IsDAG';

export type EditWorkflow = (
  id: string,
  name: string,
  edges: { from: WorkflowNodeDto; to: WorkflowNodeDto }[],
  user: User
) => Promise<string>;

export const editWorkflow =
  (
    workflowRepository: WorkflowRepository,
    getExecutableAction: GetExecutableAction,
    getTrigger: (id: string) => Promise<Trigger | undefined>
  ): EditWorkflow =>
  async (
    id: string,
    name: string,
    edgesDto: { from: WorkflowNodeDto; to: WorkflowNodeDto }[],
    user: User
  ): Promise<string> => {
    const workflow = Workflow(name, id, user.id);
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
      throw new Error('Workflow must be DAG');
    }

    edges.forEach((edge) =>
      workflow.addEdge(
        {
          ...edge.from,
          workflowId: workflow.id,
          viewProps: edge.from.viewProps
        },
        {
          ...edge.to,
          workflowId: workflow.id,
          viewProps: edge.to.viewProps
        }
      )
    );
    await workflowRepository.save(workflow);
    return workflow.id;
  };
