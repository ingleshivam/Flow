import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange, OnEdgesDelete } from '@xyflow/react';

export type NodeType = 
  | 'chatInput' 
  | 'promptTemplate' 
  | 'languageModel' 
  | 'chatOutput' 
  | 'memory' 
  | 'fileUpload' 
  | 'documentLoader' 
  | 'textSplitter' 
  | 'embeddings' 
  | 'vectorStore' 
  | 'retriever';

export type Provider = 'openai' | 'openrouter' | 'groq';

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
  provider: Provider;
  model: string;
  systemMessage: string;
  inputText: string;
  context?: string; // For RAG injected context
  apiKey?: string;
  output?: string;
}

export interface FileUploadData extends Record<string, any> {
  label: string;
  files?: { name: string; size: number; content?: string }[];
  output?: string;
}

export interface DocumentLoaderData extends Record<string, any> {
  label: string;
  documents?: { text: string; metadata: any }[];
  output?: string;
}

export interface TextSplitterData extends Record<string, any> {
  label: string;
  chunkSize?: number;
  chunkOverlap?: number;
  output?: string;
}

export interface EmbeddingsData extends Record<string, any> {
  label: string;
  provider?: 'openai' | 'local';
  model?: string;
  apiKey?: string;
  output?: string;
}

export interface VectorStoreData extends Record<string, any> {
  label: string;
  indexName?: string;
  status?: 'empty' | 'indexing' | 'ready';
  output?: string;
}

export interface RetrieverData extends Record<string, any> {
  label: string;
  topK?: number;
  output?: string;
}

export interface ChatOutputData extends Record<string, any> {
  label: string;
  output: string;
}

export interface MemoryMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface MemoryData extends Record<string, any> {
  label: string;
  /** Number of past conversation turns (user+assistant pairs) to include */
  windowSize: number;
  history: MemoryMessage[];
  output?: string;
}

export type NodeData = 
  | ChatInputData 
  | PromptTemplateData 
  | LanguageModelData 
  | ChatOutputData 
  | MemoryData 
  | FileUploadData 
  | DocumentLoaderData 
  | TextSplitterData 
  | EmbeddingsData 
  | VectorStoreData 
  | RetrieverData;

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
  deleteNode: (nodeId: string) => void;
  onNodesDelete: (deletedNodes: WorkflowNode[]) => void;
  executeWorkflow: () => Promise<void>;
  status: 'idle' | 'running' | 'success' | 'error';
  errorMessage: string | null;
  clearCanvas: () => void;
}

export const PROVIDERS: { id: Provider; label: string }[] = [
  { id: 'openai', label: 'OpenAI' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'groq', label: 'Groq' },
];

export const PROVIDER_MODELS: Record<Provider, { id: string; label: string }[]> = {
  openai: [
    { id: 'gpt-4o', label: 'GPT-4o' },
    { id: 'gpt-4.1', label: 'GPT-4.1' },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { id: 'o3-mini', label: 'o3-mini' },
  ],
  openrouter: [
    { id: 'anthropic/claude-sonnet-4-5', label: 'Claude 3.7 Sonnet' },
    { id: 'google/gemini-2.5-pro-preview', label: 'Gemini 2.5 Pro' },
    { id: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
    { id: 'openai/gpt-4o', label: 'GPT-4o (via OpenRouter)' },
    { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1' },
    { id: 'mistralai/mistral-large', label: 'Mistral Large' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
    { id: 'openai/gpt-oss-120b', label: 'GPT-OSS-120B' },
    { id: 'openai/gpt-oss-20b', label: 'GPT-OSS-20B' },
    { id: 'compound-beta', label: 'Compound Beta' },
  ],
};

// Flat list kept for backwards-compat (unused internally now)
export const MODEL_OPTIONS = Object.values(PROVIDER_MODELS).flat().map(m => m.id);
