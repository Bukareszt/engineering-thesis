export const isDAG = (edges: { from: string; to: string }[]): boolean => {
  const graph = new Map<string, string[]>();

  for (const edge of edges) {
    const { from, to } = edge;
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    graph.get(from)!.push(to);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  const hasCycle = (node: string): boolean => {
    if (!visited.has(node)) {
      visited.add(node);
      recStack.add(node);

      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) {
          return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }
    }

    recStack.delete(node);
    return false;
  };

  for (const [node] of graph) {
    if (!visited.has(node)) {
      if (hasCycle(node)) {
        return false;
      }
    }
  }

  return true;
};
