import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, OnEdgesDelete } from '@xyflow/react';

export type NodeType = 'chatInput' | 'promptTemplate' | 'languageModel' | 'chatOutput';

export interface ChatInputData extends Record<string, any> {
  label: string;
  inputText: string;
  output?: string;
}

export interface PromptTemplateData extends Record<string, any> {
  label: string;
  template: string;
  output?: string;
}

export interface LanguageModelData extends Record<string, any> {
  label: string;
  model: string;
  systemMessage: string;
  inputText: string;
  apiKey?: string;
  output?: string;
}

export interface ChatOutputData extends Record<string, any> {
  label: string;
  output: string;
}

export type NodeData = ChatInputData | PromptTemplateData | LanguageModelData | ChatOutputData;

export interface WorkflowNode extends Node {
  type: NodeType;
  data: NodeData;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onEdgesDelete: OnEdgesDelete;
  onConnect: OnConnect;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  executeWorkflow: () => Promise<void>;
  status: 'idle' | 'running' | 'success' | 'error';
  errorMessage: string | null;
  clearCanvas: () => void;
}

export const MODEL_OPTIONS = [
  'GPT-4o',
  'GPT-4.1',
  'Claude 3.7 Sonnet',
  'Gemini 2.5 Pro',
  'Llama 3.1 70B',
];
