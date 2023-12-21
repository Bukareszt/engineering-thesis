import { WorkflowNode } from './WorkflowNode';

export type Workflow = {
  readonly id: string;
  readonly name: string;
  readonly userId: string;
  addEdge: (from: WorkflowNode, to: WorkflowNode) => void;
  remove: (action: WorkflowNode) => void;
  getNext: (action: WorkflowNode) => WorkflowNode[];
  getById: (id: string) => WorkflowNode | undefined;
  getByTriggerId: (triggerId: string) => WorkflowNode[];
  getNodes: () => WorkflowNode[];
  getEdges: () => { from: string; to: string }[];
};

export const Workflow = (
  name: string,
  id: string,
  userId: string
): Workflow => {
  const nodes = new Map<string, WorkflowNode>();
  const edges: { from: string; to: string }[] = [];

  const addEdge = (from: WorkflowNode, to: WorkflowNode) => {
    nodes.set(from.id, from);
    nodes.set(to.id, to);
    edges.push({ from: from.id, to: to.id });
  };

  const remove = (node: WorkflowNode) => {
    nodes.delete(node.id);
    edges.filter((edge) => edge.from !== node.id && edge.to !== node.id);
  };

  const getNext = (node: WorkflowNode): WorkflowNode[] => {
    const nextEdges = edges.filter((edge) => edge.from === node.id);
    return nextEdges
      .map((edge) => nodes.get(edge.to))
      .filter((node) => node !== undefined) as WorkflowNode[];
  };

  const getById = (id: string): WorkflowNode | undefined => nodes.get(id);

  const getByTriggerId = (triggerId: string): WorkflowNode[] => {
    const node = Array.from(nodes.values()).find(
      (node) => node.action.id === triggerId
    );
    if (!node) {
      return [];
    }
    return getNext(node);
  };

  const getNodes = () => Array.from(nodes.values());

  const getEdges = () => edges;

  return {
    id,
    name,
    userId,
    addEdge,
    remove,
    getNext,
    getById,
    getByTriggerId,
    getNodes,
    getEdges
  };
};
