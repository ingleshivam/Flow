import { Edge } from '@xyflow/react';
import { WorkflowNode } from '@/types/workflow';

/**
 * Performs a topological sort on the workflow graph to determine execution order.
 * Uses Kahn's algorithm for cycle detection and ordering.
 * 
 * @param nodes Workflow nodes
 * @param edges Workflow edges
 * @returns Ordered list of node IDs
 * @throws Error if a cycle is detected
 */
export const getTopologicalOrder = (nodes: WorkflowNode[], edges: Edge[]): string[] => {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  // Initialize
  nodes.forEach((node) => {
    inDegree[node.id] = 0;
    adj[node.id] = [];
  });

  // Build adjacency list and calculate in-degrees
  edges.forEach((edge) => {
    if (adj[edge.source] && inDegree.hasOwnProperty(edge.target)) {
      adj[edge.source].push(edge.target);
      inDegree[edge.target]++;
    }
  });

  // Start with nodes that have no incoming edges
  const queue: string[] = [];
  nodes.forEach((node) => {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  });

  const result: string[] = [];
  while (queue.length > 0) {
    // We sort the queue by node position or creation if we want some stability, 
    // but standard topological sort allows any order for independent nodes.
    const nodeId = queue.shift()!;
    result.push(nodeId);

    adj[nodeId].forEach((neighborId) => {
      inDegree[neighborId]--;
      if (inDegree[neighborId] === 0) {
        queue.push(neighborId);
      }
    });
  }

  if (result.length !== nodes.length) {
    throw new Error('The workflow contains a circular dependency (cycle) and cannot be executed.');
  }

  return result;
};

/**
 * Gets all incoming edges for a specific node and its handle.
 */
export const getIncomingEdges = (nodeId: string, edges: Edge[], handle?: string) => {
  return edges.filter((edge) => 
    edge.target === nodeId && (!handle || edge.targetHandle === handle)
  );
};

/**
 * Gets all outgoing edges for a specific node.
 */
export const getOutgoingEdges = (nodeId: string, edges: Edge[], handle?: string) => {
  return edges.filter((edge) => 
    edge.source === nodeId && (!handle || edge.sourceHandle === handle)
  );
};
