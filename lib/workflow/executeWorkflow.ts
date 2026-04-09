import { Edge } from '@xyflow/react';
import {
  WorkflowNode,
  ChatInputData,
  PromptTemplateData,
  LanguageModelData,
  MemoryData,
  MemoryMessage,
  FileUploadData,
} from '@/types/workflow';
import { getTopologicalOrder, getIncomingEdges } from './graphUtils';

/**
 * Dynamic Workflow Execution Engine
 * 
 * Executes nodes in topological order, passing data through connections.
 */
export const executeWorkflowLogic = async (nodes: WorkflowNode[], edges: Edge[]): Promise<WorkflowNode[]> => {
  let updatedNodes = [...nodes];

  // 1. Get execution order
  const order = getTopologicalOrder(nodes, edges);

  // 2. Map to store execution results (Node ID -> its primary output)
  const executionResults = new Map<string, any>();

  // 3. Sequential Execution
  for (const nodeId of order) {
    const node = updatedNodes.find(n => n.id === nodeId)!;

    // Resolve inputs for this node using "First Come First Serve" policy for handles
    const inputs: Record<string, any> = {};
    const incomingEdges = getIncomingEdges(nodeId, edges);

    const handlesFilled = new Set<string>();
    for (const edge of incomingEdges) {
      const handle = edge.targetHandle || 'default';
      if (!handlesFilled.has(handle)) {
        const sourceId = edge.source;
        if (executionResults.has(sourceId)) {
          inputs[handle] = executionResults.get(sourceId);
          handlesFilled.add(handle);
        }
      }
    }

    // Process the node
    const result = await processNode(node, inputs, updatedNodes, edges);

    // Store result and update node data in the list
    executionResults.set(nodeId, result.output);
    updatedNodes = updateNodeOutput(updatedNodes, nodeId, result.dataUpdates);
  }

  return updatedNodes;
};

/**
 * Individual Node Processing Logic
 */
const processNode = async (
  node: WorkflowNode,
  inputs: Record<string, any>,
  allNodes: WorkflowNode[],
  allEdges: Edge[]
): Promise<{ output: any; dataUpdates: any }> => {
  switch (node.type) {
    case 'chatInput': {
      const data = node.data as ChatInputData;
      return { output: data.inputText, dataUpdates: { output: data.inputText } };
    }

    case 'promptTemplate': {
      const data = node.data as PromptTemplateData;
      // If there's an input handle connected, we could potentially do interpolation here,
      // but for now we follow the existing logic where LLM does the interpolation.
      return { output: data.template, dataUpdates: { output: data.template } };
    }

    case 'languageModel': {
      const data = node.data as LanguageModelData;
      const inputContent = inputs['input'] || '';
      const systemContent = inputs['systemMessage'] || '';
      const contextContent = inputs['context'] || '';
      const historyMessages: MemoryMessage[] = inputs['memory'] || [];

      if (!data.apiKey) throw new Error(`API Key missing for ${data.label}`);

      // Build Prompt (Existing interpolation logic)
      let finalSystemPrompt = systemContent.replace(/\{\{\s*input\s*\}\}/g, inputContent);
      if (contextContent) {
        finalSystemPrompt = `${finalSystemPrompt}\n\nUSE THE FOLLOWING CONTEXT TO ANSWER THE QUESTION:\n${contextContent}`;
      }

      // Execute LLM Request
      const provider = data.provider || 'openai';
      const ENDPOINTS: Record<string, string> = {
        openai: 'https://api.openai.com/v1/chat/completions',
        openrouter: 'https://openrouter.ai/api/v1/chat/completions',
        groq: 'https://api.groq.com/openai/v1/chat/completions',
      };
      const endpoint = ENDPOINTS[provider] ?? ENDPOINTS.openai;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.apiKey}`,
      };

      const messages = [
        { role: 'system', content: finalSystemPrompt },
        ...historyMessages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: inputContent },
      ];

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: data.model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`LLM Error: ${errorData.error?.message || response.statusText}`);
      }

      const json = await response.json();
      const outputText = json.choices?.[0]?.message?.content || '';

      return {
        output: outputText,
        dataUpdates: {
          output: outputText,
          inputText: inputContent,
          systemMessage: finalSystemPrompt,
          context: contextContent
        }
      };
    }

    case 'memory': {
      const data = node.data as MemoryData;
      const windowSize = data.windowSize ?? 5;
      const history = (data.history ?? []).slice(-(windowSize * 2));

      // Memory node doesn't "process" much in real-time, it provides history to LLM
      // and updates itself AFTER LLM finishes. 
      // Wait, in a truly sequential model, LLM updates memory?
      // For now, we return the history as the "output" for the LLM to consume.
      return { output: history, dataUpdates: { output: `History loaded (${history.length} messages)` } };
    }

    case 'retriever': {
      // Mock Retrieval logic from original implementation
      // It looks backwards to find a FileUpload node
      let retrievedContext = '';

      // Find the connected Vector Store (handle 'db')
      const vectorStoreResult = inputs['db'];
      // In the new dynamic logic, 'db' should contain the vector store "state" or identifier.
      // But for the mock, we traverse backward manually to simulate a RAG chain if not fully implemented.

      // Let's check handles first
      if (vectorStoreResult) {
        retrievedContext = "Retrieved context from mock vector store indexed data.";
      } else {
        // Fallback to original mock behavior: look for any FileUpload node in the system
        const uploadNode = allNodes.find(n => n.type === 'fileUpload');
        if (uploadNode) {
          const fileData = uploadNode.data as FileUploadData;
          if (fileData.files && fileData.files.length > 0) {
            retrievedContext = `Retrieved context from: ${fileData.files.map(f => f.name).join(', ')}. \n\nThis is mock retrieved text.`;
          }
        }
      }

      return { output: retrievedContext, dataUpdates: { output: retrievedContext ? 'Retrieval successful' : 'No context found' } };
    }

    case 'chatOutput': {
      const outputValue = inputs['default'] || inputs['input'] || '';
      return { output: outputValue, dataUpdates: { output: outputValue } };
    }

    case 'fileUpload': {
      const data = node.data as FileUploadData;
      return { output: data.files, dataUpdates: { output: `${data.files?.length || 0} files uploaded` } };
    }

    case 'documentLoader': {
      // Receives files from fileUpload
      const files = inputs['default'] || inputs['input'];
      let outputText = 'No files received from uploader.';
      let extractedDocs: { text: string; metadata: any }[] = [];

      if (Array.isArray(files) && files.length > 0) {
        extractedDocs = files.map(f => ({
          text: f.content || `[Extracted mock content from ${f.name}]\n\nThis is the standardized text format of the document contents.`,
          metadata: { name: f.name, size: f.size }
        }));
        outputText = `Extracted text from ${extractedDocs.length} document(s).`;
      } else if (files && files.name) {
        extractedDocs = [{
          text: files.content || `[Extracted mock content from ${files.name}]\n\nThis is the standardized text format of the document contents.`,
          metadata: { name: files.name, size: files.size }
        }];
        outputText = `Extracted text from 1 document.`;
      }

      return {
        output: extractedDocs,
        dataUpdates: { output: outputText, documents: extractedDocs }
      };
    }

    case 'textSplitter': {
      // Receives documents from documentLoader
      const docs = inputs['default'] || inputs['input'];
      const data = node.data as any; // TextSplitterData
      let chunks: any[] = [];
      let outputText = 'No documents received to split.';

      if (Array.isArray(docs) && docs.length > 0) {
        // Mock chunking logic
        chunks = docs.map(doc => ({
          text: `[CHUNK]: ${doc.text.substring(0, data.chunkSize || 1000)}...`,
          metadata: { ...doc.metadata, chunked: true }
        }));
        // Just creating a few mock chunks per doc for illustration
        if (data.chunkSize && data.chunkSize < 500) {
          chunks.push(...chunks.map(c => ({ ...c, text: c.text + " (part 2)" })));
        }
        outputText = `Generated ${chunks.length} chunks from ${docs.length} document(s).`;
      }

      return {
        output: chunks,
        dataUpdates: { output: outputText, chunks }
      };
    }

    default:
      // Default behavior: just pass through the first input or node data output
      return { output: inputs['default'] || node.data.output, dataUpdates: {} };
  }
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
