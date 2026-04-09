import { Edge } from '@xyflow/react';
import { 
  WorkflowNode, 
  ChatInputData, 
  PromptTemplateData, 
  LanguageModelData 
} from '@/types/workflow';
import { getTopologicalOrder } from './graphUtils';

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates the workflow graph for cycles and required node configurations.
 * 
 * @param nodes Workflow nodes
 * @param edges Workflow edges
 * @returns ValidationResult
 */
export const validateWorkflow = (nodes: WorkflowNode[], edges: Edge[]): ValidationResult => {
  if (nodes.length === 0) {
    return { isValid: false, error: 'Add at least one node to the canvas.' };
  }

  // 1. Cycle Detection (and ordering check)
  try {
    getTopologicalOrder(nodes, edges);
  } catch (error: any) {
    return { isValid: false, error: error.message };
  }

  // 2. Node-specific validation
  for (const node of nodes) {
    switch (node.type) {
      case 'languageModel': {
        const data = node.data as LanguageModelData;
        
        // Required handles: input, systemMessage
        const hasInput = edges.some(e => e.target === node.id && e.targetHandle === 'input');
        const hasSystem = edges.some(e => e.target === node.id && e.targetHandle === 'systemMessage');
        
        if (!hasInput) {
          return { isValid: false, error: `Language Model "${data.label}" requires an input connection.` };
        }
        if (!hasSystem) {
          return { isValid: false, error: `Language Model "${data.label}" requires a system message connection.` };
        }
        
        if (!data.apiKey) {
          return { isValid: false, error: `API Key is required for Language Model "${data.label}".` };
        }
        break;
      }

      case 'chatInput': {
        const data = node.data as ChatInputData;
        if (!data.inputText) {
          return { isValid: false, error: `Text is required for Chat Input "${data.label}".` };
        }
        break;
      }

      case 'promptTemplate': {
        const data = node.data as PromptTemplateData;
        if (!data.template) {
          return { isValid: false, error: `Template text is required for Prompt Template "${data.label}".` };
        }
        break;
      }
      
      // Add more cases here as other nodes get specific requirements
      default:
        break;
    }
  }

  return { isValid: true, error: null };
};
