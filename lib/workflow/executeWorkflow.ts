import { Edge } from '@xyflow/react';
import { WorkflowNode, ChatInputData, PromptTemplateData, LanguageModelData } from '@/types/workflow';

/**
 * Advanced execution logic:
 * 1. Finds the Language Model node.
 * 2. Traces back its 'input' handle to find the Chat Input content.
 * 3. Traces back its 'systemMessage' handle to find the Prompt Template content.
 * 4. Verifies API Key.
 * 5. Mock executes and updates outputs.
 */
export const executeWorkflowLogic = async (nodes: WorkflowNode[], edges: Edge[]): Promise<WorkflowNode[]> => {
  let updatedNodes = [...nodes];

  // 1. Find the main components
  const llmNode = updatedNodes.find(n => n.type === 'languageModel');
  if (!llmNode) throw new Error('Language Model node not found on canvas');

  const llmData = llmNode.data as LanguageModelData;
  if (!llmData.apiKey) throw new Error('API Key is missing for the Language Model');

  // 2. Resolve Input (Chat Input -> LM.input)
  const inputEdge = edges.find(e => e.target === llmNode.id && e.targetHandle === 'input');
  let inputContent = '';
  if (inputEdge) {
    const sourceNode = nodes.find(n => n.id === inputEdge.source);
    if (sourceNode?.type === 'chatInput') {
      inputContent = (sourceNode.data as ChatInputData).inputText;
    }
  } else {
    throw new Error('Please connect a Chat Input node to the Input handle of the Language Model');
  }

  // 3. Resolve System Message (Prompt Template -> LM.systemMessage)
  const systemEdge = edges.find(e => e.target === llmNode.id && e.targetHandle === 'systemMessage');
  let systemContent = '';
  if (systemEdge) {
    const sourceNode = nodes.find(n => n.id === systemEdge.source);
    if (sourceNode?.type === 'promptTemplate') {
      systemContent = (sourceNode.data as PromptTemplateData).template;
    }
  } else {
    throw new Error('Please connect a Prompt Template node to the System Message handle of the Language Model');
  }

  // 4. Execute Simulation
  await new Promise(resolve => setTimeout(resolve, 2000));

  const mockedResponse = `[${llmData.model} Output]
Authenticated with API Key: ${llmData.apiKey.slice(0, 4)}...${llmData.apiKey.slice(-4)}

System: ${systemContent}
Input: ${inputContent}

Response: This is a generated response based on your system message and user input. The workflow processed both separate paths successfully.`;

  // 5. Update LLM node output
  updatedNodes = updateNodeOutput(updatedNodes, llmNode.id, { 
    output: mockedResponse,
    inputText: inputContent,
    systemMessage: systemContent
  });

  // 6. Push to Chat Output if connected
  const outputEdge = edges.find(e => e.source === llmNode.id);
  if (outputEdge) {
    const outputNode = nodes.find(n => n.id === outputEdge.target);
    if (outputNode?.type === 'chatOutput') {
      updatedNodes = updateNodeOutput(updatedNodes, outputNode.id, { output: mockedResponse });
    }
  }

  return updatedNodes;
};

const updateNodeOutput = (nodes: WorkflowNode[], id: string, dataUpdates: any): WorkflowNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return {
        ...node,
        data: {
          ...node.data,
          ...dataUpdates
        }
      };
    }
    return node;
  });
};
