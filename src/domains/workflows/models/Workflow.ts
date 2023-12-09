import { WorkflowNode } from './WorkflowNode';

export type Workflow = {
  readonly id: string;
  readonly name: string;
  addEdge: (from: WorkflowNode, to: WorkflowNode) => void;
  remove: (action: WorkflowNode) => void;
  getNext: (action: WorkflowNode) => WorkflowNode[];
  getById: (id: string) => WorkflowNode | undefined;
};

export const Workflow = (name: string, id: string): Workflow => {
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

  return {
    id,
    name,
    addEdge,
    remove,
    getNext,
    getById
  };
};