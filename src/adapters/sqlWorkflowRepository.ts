import { Kysely } from 'kysely';
import { DB } from '../db/dbTypes';
import { Workflow } from '../domains/workflows/models/Workflow';
import { WorkflowRepository } from '../domains/workflows/ports/WorkflowRepository';

export const sqlWorkflowRepository = (db: Kysely<DB>): WorkflowRepository => {
  const save = async (workflow: Workflow) => {
    try {
      const nodes = workflow.getNodes().map((node) => ({
        id: node.id,
        actionId: node.action.id,
        viewProps: node.viewProps
      }));

      const edges = workflow.getEdges();

      await db
        .insertInto('workflows')
        .values({
          id: workflow.id,
          name: workflow.name,
          nodes: JSON.stringify(nodes),
          edges: JSON.stringify(edges),
          user_id: workflow.userId
        })
        .onConflict((conflict) =>
          conflict.column('id').doUpdateSet({
            name: workflow.name,
            nodes: JSON.stringify(nodes),
            edges: JSON.stringify(edges)
          })
        )
        .execute();
    } catch (e) {
      throw e;
    }
  };

  const get = async (id: string): Promise<Workflow | undefined> => {
    const result = await db
      .selectFrom('workflows')
      .where('id', '=', id)
      .select(['id', 'name', 'nodes', 'edges', 'user_id'])
      .executeTakeFirst();
    if (!result) return undefined;

    const nodes = result.nodes as {
      id: string;
      actionId: string;
      viewProps: { x: number; y: number };
    }[];

    const edges = result.edges as {
      from: string;
      to: string;
    }[];
    const actionsIds = nodes.map((node) => node.actionId);

    const triggers = await db
      .selectFrom('triggers')
      .selectAll()
      .where('id', 'in', actionsIds)
      .execute();

    const actions = await db
      .selectFrom('executable_actions')
      .selectAll()
      .where('id', 'in', actionsIds)
      .execute();

    const workflowInstance = Workflow(result.name, result.id, result.user_id);

    edges.forEach((edge) => {
      const from = nodes.find((node) => node.id === edge.from);
      const to = nodes.find((node) => node.id === edge.to);
      const toAction =
        actions.find((action) => action.id === to?.actionId) ??
        triggers.find((trigger) => trigger.id === to?.actionId);
      const fromAction =
        actions.find((action) => action.id === from?.actionId) ??
        triggers.find((trigger) => trigger.id === from?.actionId);
      if (!from || !to || !toAction || !fromAction) return;

      workflowInstance.addEdge(
        {
          id: from.id,
          action: { ...fromAction, userId: result.user_id },
          workflowId: workflowInstance.id,
          viewProps: from.viewProps
        },
        {
          id: to.id,
          action: { ...toAction, userId: result.user_id },
          workflowId: workflowInstance.id,
          viewProps: to.viewProps
        }
      );
    });

    return workflowInstance;
  };

  const getAll = async (userId: string): Promise<Workflow[]> => {
    const result = await db
      .selectFrom('workflows')
      .select(['id', 'name', 'nodes', 'edges'])
      .where('user_id', '=', userId)
      .execute();

    return (await Promise.all(
      result
        .map(async (workflow) => await get(workflow.id))
        .filter((workflow) => workflow !== undefined)
    )) as Workflow[];
  };

  const remove = async (id: string): Promise<void> => {
    await db.deleteFrom('workflows').where('id', '=', id).execute();
  };

  return {
    save,
    get,
    getAll,
    remove
  };
};
