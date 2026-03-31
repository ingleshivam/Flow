'use client';

import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Panel,
  Connection,
  Edge,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react';
import { useWorkflowStore } from '@/store/workflowStore';
import ChatInputNode from '../nodes/ChatInputNode';
import PromptTemplateNode from '../nodes/PromptTemplateNode';
import LanguageModelNode from '../nodes/LanguageModelNode';
import ChatOutputNode from '../nodes/ChatOutputNode';
import { NodeType, WorkflowNode, ChatInputData, PromptTemplateData, LanguageModelData } from '@/types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { Layout } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import DeletableEdge from '../edges/DeletableEdge';

const nodeTypes = {
  chatInput: ChatInputNode,
  promptTemplate: PromptTemplateNode,
  languageModel: LanguageModelNode,
  chatOutput: ChatOutputNode,
};

const edgeTypes = {
  default: DeletableEdge,
};

const CanvasFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onEdgesDelete, onConnect, setNodes } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type,
        position,
        data: { 
          label: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1'),
          ...(type === 'chatInput' ? { inputText: '' } : {}),
          ...(type === 'promptTemplate' ? { template: 'Answer the following question: {{input}}' } : {}),
          ...(type === 'languageModel' ? { model: 'GPT-4o', systemMessage: '', inputText: '', apiKey: '' } : {}),
          ...(type === 'chatOutput' ? { output: '' } : {}),
        } as any,
      };

      setNodes([...nodes, newNode]);
    },
    [screenToFlowPosition, nodes, setNodes]
  );

  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes as any}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        onInit={() => console.log('Flow Initialized')}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'default' }}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} color="#cbd5e1" size={1.5} />
        <Controls />
        <MiniMap zoomable pannable />
        {nodes.length === 0 && (
          <Panel position="top-center" className="mt-40">
            <Card className="bg-white/80 backdrop-blur-md border-slate-200 p-8 rounded-[32px] shadow-2xl text-center max-w-sm border-none ring-1 ring-slate-200/50">
              <CardContent className="p-0">
                <div className="bg-blue-600/10 p-4 rounded-2xl w-fit mx-auto mb-6 shadow-inner">
                  <Layout className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Build your engine</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Drag components from the sidebar and connect them to assemble a custom AI automation workflow.
                </p>
              </CardContent>
            </Card>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

const CanvasFlowWrapper = () => (
  <ReactFlowProvider>
    <CanvasFlow />
  </ReactFlowProvider>
);

export default CanvasFlowWrapper;
