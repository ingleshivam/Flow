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

  // 4. Parse Prompt Templates (Replace any {{input}} variables)
  const formattedSystemPrompt = systemContent.replace(/\{\{\s*input\s*\}\}/g, inputContent);

  // 5. Execute Live LLM Request
  let liveResponseText = '';
  try {
    const isOpenRouter = llmData.model.includes('/') || llmData.model.toLowerCase().includes('claude') || llmData.model.toLowerCase().includes('gemini') || llmData.model.toLowerCase().includes('llama');
    const endpoint = isOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmData.apiKey}`
    };

    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'http://localhost:3000'; // Required by OpenRouter
      headers['X-Title'] = 'Flow AI Workflow Builder';
    }

    // Determine actual model name. Since options include 'GPT-4o', map to correct ID if necessary, or pass strictly if OpenRouter.
    let apiModelID = llmData.model;
    if (!isOpenRouter) {
      if (apiModelID.toLowerCase() === 'gpt-4o') apiModelID = 'gpt-4o';
      if (apiModelID.toLowerCase() === 'gpt-4.1') apiModelID = 'gpt-4-turbo'; // Fallback mapping for OpenAI
    }

    const payload = {
      model: apiModelID,
      messages: [
        { role: 'system', content: formattedSystemPrompt },
        { role: 'user', content: inputContent }
      ],
      temperature: 0.7,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const json = await response.json();
    liveResponseText = json.choices?.[0]?.message?.content || 'Error: No response content received.';
  } catch (err: any) {
    liveResponseText = `[Execution Failed] ${err.message}`;
    throw new Error(`LLM Execution failed: ${err.message}`);
  }

  // 6. Update LLM node output
  updatedNodes = updateNodeOutput(updatedNodes, llmNode.id, { 
    output: liveResponseText,
    inputText: inputContent,
    systemMessage: formattedSystemPrompt
  });

  // 7. Push to Chat Output if connected
  const outputEdge = edges.find(e => e.source === llmNode.id);
  if (outputEdge) {
    const outputNode = nodes.find(n => n.id === outputEdge.target);
    if (outputNode?.type === 'chatOutput') {
      updatedNodes = updateNodeOutput(updatedNodes, outputNode.id, { output: liveResponseText });
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
