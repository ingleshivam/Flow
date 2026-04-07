import { create } from 'zustand';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  NodeChange,
  EdgeChange,
  OnConnect,
  OnEdgesChange,
  OnEdgesDelete,
  OnNodesChange,
} from '@xyflow/react';
import { WorkflowNode, WorkflowState, NodeData } from '@/types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const getInitialNodes = (): WorkflowNode[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('workflow-nodes');
  return saved ? JSON.parse(saved) : [];
};

const getInitialEdges = (): Edge[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('workflow-edges');
  return saved ? JSON.parse(saved) : [];
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: getInitialNodes(),
  edges: getInitialEdges(),
  status: 'idle',
  errorMessage: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
    // Save to localStorage
    localStorage.setItem('workflow-nodes', JSON.stringify(get().nodes));
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
    // Save to localStorage
    localStorage.setItem('workflow-edges', JSON.stringify(get().edges));
  },

  onEdgesDelete: (deletedEdges: Edge[]) => {
    set({
      edges: get().edges.filter((edge) => !deletedEdges.some((d) => d.id === edge.id)),
    });
    localStorage.setItem('workflow-edges', JSON.stringify(get().edges));
    toast.success('Edge deleted');
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
    // Save to localStorage
    localStorage.setItem('workflow-edges', JSON.stringify(get().edges));
  },

  setNodes: (nodes: WorkflowNode[]) => {
    set({ nodes });
    localStorage.setItem('workflow-nodes', JSON.stringify(nodes));
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
    localStorage.setItem('workflow-edges', JSON.stringify(edges));
  },

  updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
    localStorage.setItem('workflow-nodes', JSON.stringify(get().nodes));
  },
  
  onNodesDelete: (deletedNodes: WorkflowNode[]) => {
    set({
      nodes: get().nodes.filter((node) => !deletedNodes.some((d) => d.id === node.id)),
    });
    localStorage.setItem('workflow-nodes', JSON.stringify(get().nodes));
    toast.success('Node removed');
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      // Also remove any connected edges
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
    localStorage.setItem('workflow-nodes', JSON.stringify(get().nodes));
    localStorage.setItem('workflow-edges', JSON.stringify(get().edges));
    toast.success('Node removed');
  },

  executeWorkflow: async () => {
    const { nodes, edges } = get();
    set({ status: 'running', errorMessage: null });

    try {
      // Import the execution engine dynamically to avoid circular dependencies if any
      const { validateWorkflow } = await import('@/lib/workflow/validateWorkflow');
      const { executeWorkflowLogic } = await import('@/lib/workflow/executeWorkflow');

      const validation = validateWorkflow(nodes, edges);
      if (!validation.isValid) {
        set({ status: 'error', errorMessage: validation.error });
        toast.error(validation.error);
        return;
      }

      const updatedNodes = await executeWorkflowLogic(nodes, edges);
      set({ nodes: updatedNodes, status: 'success' });
      toast.success('Workflow executed successfully!');
      localStorage.setItem('workflow-nodes', JSON.stringify(updatedNodes));
    } catch (error: any) {
      set({ status: 'error', errorMessage: error.message || 'An error occurred during execution' });
      toast.error(error.message || 'Execution failed');
    }
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], status: 'idle', errorMessage: null });
    localStorage.removeItem('workflow-nodes');
    localStorage.removeItem('workflow-edges');
    toast.success('Canvas cleared');
  },
}));
