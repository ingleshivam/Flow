import { Edge } from '@xyflow/react';
import { WorkflowNode, ChatInputData, PromptTemplateData, LanguageModelData, MemoryData, MemoryMessage } from '@/types/workflow';

/**
 * Advanced execution logic:
 * 1. Finds the Language Model node.
 * 2. Traces back its 'input' handle to find the Chat Input content.
 * 3. Traces back its 'systemMessage' handle to find the Prompt Template content.
 * 4. (Optional) Traces back its 'memory' handle to inject conversation history.
 * 5. Verifies API Key.
 * 6. Executes the LLM request.
 * 7. Saves the new turn back to the Memory node (if connected).
 * 8. Pushes output to Chat Output node.
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

  // 5. Resolve Memory (optional — Memory node -> LM.memory)
  let memoryNode: WorkflowNode | null = null;
  let historyMessages: MemoryMessage[] = [];

  const memoryEdge = edges.find(e => e.target === llmNode.id && e.targetHandle === 'memory');
  if (memoryEdge) {
    const sourceNode = nodes.find(n => n.id === memoryEdge.source);
    if (sourceNode?.type === 'memory') {
      memoryNode = sourceNode;
      const memData = sourceNode.data as MemoryData;
      const windowSize = memData.windowSize ?? 5;
      // Grab the last N turns (each turn = user + assistant, so 2 messages per turn)
      historyMessages = (memData.history ?? []).slice(-(windowSize * 2));
    }
  }

  // 6. Execute Live LLM Request
  let liveResponseText = '';
  try {
    const provider = llmData.provider || 'openai';

    // --- Resolve endpoint ---
    const ENDPOINTS: Record<string, string> = {
      openai: 'https://api.openai.com/v1/chat/completions',
      openrouter: 'https://openrouter.ai/api/v1/chat/completions',
      groq: 'https://api.groq.com/openai/v1/chat/completions',
    };
    const endpoint = ENDPOINTS[provider] ?? ENDPOINTS.openai;

    // --- Build headers ---
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmData.apiKey}`,
    };
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'Flow AI Workflow Builder';
    }

    // Model ID is stored directly as the API-ready string in PROVIDER_MODELS
    const apiModelID = llmData.model;

    // Build messages: system → history turns → current user message
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: formattedSystemPrompt },
      ...historyMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: inputContent },
    ];

    const payload = {
      model: apiModelID,
      messages,
      temperature: 0.7,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
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

  // 7. Update LLM node output
  updatedNodes = updateNodeOutput(updatedNodes, llmNode.id, {
    output: liveResponseText,
    inputText: inputContent,
    systemMessage: formattedSystemPrompt,
  });

  // 8. Save the new turn back to the Memory node
  if (memoryNode) {
    const memData = memoryNode.data as MemoryData;
    const newHistory: MemoryMessage[] = [
      ...(memData.history ?? []),
      { role: 'user', content: inputContent, timestamp: Date.now() },
      { role: 'assistant', content: liveResponseText, timestamp: Date.now() },
    ];
    updatedNodes = updateNodeOutput(updatedNodes, memoryNode.id, { history: newHistory });
  }

  // 9. Push to Chat Output if connected
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
          ...dataUpdates,
        },
      };
    }
    return node;
  });
};
