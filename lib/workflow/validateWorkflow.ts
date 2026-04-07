import { Edge } from '@xyflow/react';
import { WorkflowNode, ChatInputData, PromptTemplateData, LanguageModelData, MemoryData } from '@/types/workflow';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const validateWorkflow = (nodes: WorkflowNode[], edges: Edge[]): ValidationResult => {
  // 1. Check if each node type is present
  const hasChatInput = nodes.some((n) => n.type === 'chatInput');
  const hasPromptTemplate = nodes.some((n) => n.type === 'promptTemplate');
  const hasLanguageModel = nodes.some((n) => n.type === 'languageModel');
  const hasChatOutput = nodes.some((n) => n.type === 'chatOutput');

  if (!hasChatInput) return { isValid: false, error: 'Add a Chat Input node.' };
  if (!hasPromptTemplate) return { isValid: false, error: 'Add a Prompt Template node.' };
  if (!hasLanguageModel) return { isValid: false, error: 'Add a Language Model node.' };
  if (!hasChatOutput) return { isValid: false, error: 'Add a Chat Output node.' };

  // 2. Find the LLM node for specific handle checks
  const llmNode = nodes.find(n => n.type === 'languageModel');
  if (!llmNode) return { isValid: false, error: 'Language Model node not found.' };

  // 3. Check Language Model Input connection
  const hasInputConnection = edges.some(e => 
    e.target === llmNode.id && e.targetHandle === 'input'
  );
  if (!hasInputConnection) {
    return { isValid: false, error: 'Connect Chat Input to the "Input" handle of Language Model.' };
  }

  // 4. Check Language Model System Message connection
  const hasSystemConnection = edges.some(e => 
    e.target === llmNode.id && e.targetHandle === 'systemMessage'
  );
  if (!hasSystemConnection) {
    return { isValid: false, error: 'Connect Prompt Template to the "System Message" handle of Language Model.' };
  }

  // 5. Check Language Model to Output connection
  const hasOutputConnection = edges.some(e => 
    e.source === llmNode.id && nodes.find(n => n.id === e.target)?.type === 'chatOutput'
  );
  if (!hasOutputConnection) {
    return { isValid: false, error: 'Connect Language Model to Chat Output.' };
  }

  // 6. Check required fields and API Key
  for (const node of nodes) {
    if (node.type === 'chatInput') {
      const data = node.data as ChatInputData;
      if (!data.inputText) return { isValid: false, error: 'Chat Input text is required.' };
    }
    if (node.type === 'promptTemplate') {
      const data = node.data as PromptTemplateData;
      if (!data.template) return { isValid: false, error: 'Prompt Template text is required.' };
    }
    if (node.type === 'languageModel') {
      const data = node.data as LanguageModelData;
      if (!data.apiKey) return { isValid: false, error: 'API Key is required for Language Model.' };
    }
  }

  return { isValid: true, error: null };
};
