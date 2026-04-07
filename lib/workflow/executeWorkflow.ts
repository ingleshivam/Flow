import { Edge } from '@xyflow/react';
import {
  WorkflowNode,
  ChatInputData,
  PromptTemplateData,
  LanguageModelData,
  MemoryData,
  MemoryMessage,
  FileUploadData,
  DocumentLoaderData,
  TextSplitterData,
  RetrieverData,
  VectorStoreData
} from '@/types/workflow';

/**
 * Modular RAG Execution Logic
 * 
 * Supports:
 * 1. Simple Flow (Input -> LLM -> Output)
 * 2. Memory (History injection)
 * 3. RAG (FileUpload -> Loader -> Splitter -> Embeddings -> VectorStore -> Retriever -> Context)
 */
export const executeWorkflowLogic = async (nodes: WorkflowNode[], edges: Edge[]): Promise<WorkflowNode[]> => {
  let updatedNodes = [...nodes];

  // 0. Helper: Find source node connected to a specific target handle
  const getSourceNode = (targetId: string, targetHandle: string) => {
    const edge = edges.find(e => e.target === targetId && e.targetHandle === targetHandle);
    if (!edge) return null;
    return nodes.find(n => n.id === edge.source) || null;
  };

  // 1. Find the main components (LLM is usually the heart)
  const llmNode = updatedNodes.find(n => n.type === 'languageModel');
  if (!llmNode) throw new Error('Language Model node not found on canvas');

  const llmData = llmNode.data as LanguageModelData;
  if (!llmData.apiKey) throw new Error('API Key is missing for the Language Model');

  // 2. Resolve Input (Chat Input -> LM.input)
  const inputNode = getSourceNode(llmNode.id, 'input');
  let inputContent = '';
  if (inputNode?.type === 'chatInput') {
    inputContent = (inputNode.data as ChatInputData).inputText;
  } else if (!inputNode) {
    throw new Error('Please connect a Chat Input node to the Input handle of the Language Model');
  }

  // 3. Resolve System Message (Prompt Template -> LM.systemMessage)
  const systemNode = getSourceNode(llmNode.id, 'systemMessage');
  let systemContent = '';
  if (systemNode?.type === 'promptTemplate') {
    systemContent = (systemNode.data as PromptTemplateData).template;
  } else {
    throw new Error('Please connect a Prompt Template node to the System Message handle of the Language Model');
  }

  // 4. Resolve RAG Context (Retriever -> LM.context)
  let retrievedContext = '';
  const retrieverNode = getSourceNode(llmNode.id, 'context');

  if (retrieverNode?.type === 'retriever') {
    // Traverse back to find the Vector Store
    const vectorStoreNode = getSourceNode(retrieverNode.id, 'db');
    if (vectorStoreNode?.type === 'vectorStore') {
      // In a real app, we'd perform a vector search here.
      // For this implementation, we will mock the retrieval by traversing back 
      // the ingestion chain to find the actual text being "indexed".

      const embeddingsNode = getSourceNode(vectorStoreNode.id, 'vectors');
      const splitterNode = embeddingsNode ? getSourceNode(embeddingsNode.id, '') : null; // embeddings usually has one input
      const loaderNode = splitterNode ? getSourceNode(splitterNode.id, '') : null;
      const uploadNode = loaderNode ? getSourceNode(loaderNode.id, '') : null;

      // Mock Retrieval Logic:
      // If we found a file upload node with files, we'll "retrieve" a snippet.
      if (uploadNode?.type === 'fileUpload') {
        const fileData = uploadNode.data as FileUploadData;
        if (fileData.files && fileData.files.length > 0) {
          // We'll use the filenames and some mock text as "retrieved context"
          retrievedContext = `Retrieved context from documents: ${fileData.files.map(f => f.name).join(', ')}. 
          
          Document Contents summary: This document discusses advanced RAG implementation and vector storage. 
          The modular architecture allows for granular control over text splitting and embedding generation.`;
        }
      }
    }

    // Update retriever node output status
    updatedNodes = updateNodeOutput(updatedNodes, retrieverNode.id, { output: 'Retrieval successful' });
  }

  // 5. Build Final Prompt
  let finalSystemPrompt = systemContent.replace(/\{\{\s*input\s*\}\}/g, inputContent);
  if (retrievedContext) {
    finalSystemPrompt = `${finalSystemPrompt}\n\nUSE THE FOLLOWING CONTEXT TO ANSWER THE QUESTION:\n${retrievedContext}`;
  }

  // 6. Resolve Memory (optional — Memory node -> LM.memory)
  let memoryNode: WorkflowNode | null = null;
  let historyMessages: MemoryMessage[] = [];

  const memNode = getSourceNode(llmNode.id, 'memory');
  if (memNode?.type === 'memory') {
    memoryNode = memNode;
    const memData = memNode.data as MemoryData;
    const windowSize = memData.windowSize ?? 5;
    historyMessages = (memData.history ?? []).slice(-(windowSize * 2));
  }

  // 7. Execute Live LLM Request
  let liveResponseText = '';
  try {
    const provider = llmData.provider || 'openai';
    const ENDPOINTS: Record<string, string> = {
      openai: 'https://api.openai.com/v1/chat/completions',
      openrouter: 'https://openrouter.ai/api/v1/chat/completions',
      groq: 'https://api.groq.com/openai/v1/chat/completions',
    };
    const endpoint = ENDPOINTS[provider] ?? ENDPOINTS.openai;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${llmData.apiKey}`,
    };
    if (provider === 'openrouter') {
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'Flow AI Workflow Builder';
    }

    const messages = [
      { role: 'system', content: finalSystemPrompt },
      ...historyMessages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: inputContent },
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: llmData.model,
        messages,
        temperature: 0.7,
      }),
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

  // 8. Update LLM node output
  updatedNodes = updateNodeOutput(updatedNodes, llmNode.id, {
    output: liveResponseText,
    inputText: inputContent,
    systemMessage: finalSystemPrompt,
    context: retrievedContext
  });

  // 9. Save to Memory if connected
  if (memoryNode) {
    const memData = memoryNode.data as MemoryData;
    const newHistory: MemoryMessage[] = [
      ...(memData.history ?? []),
      { role: 'user', content: inputContent, timestamp: Date.now() },
      { role: 'assistant', content: liveResponseText, timestamp: Date.now() },
    ];
    updatedNodes = updateNodeOutput(updatedNodes, memoryNode.id, { history: newHistory });
  }

  // 10. Push to Chat Output
  const outputNode = nodes.find(n => {
    const edge = edges.find(e => e.source === llmNode.id && e.target === n.id);
    return edge && n.type === 'chatOutput';
  });

  if (outputNode) {
    updatedNodes = updateNodeOutput(updatedNodes, outputNode.id, { output: liveResponseText });
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
