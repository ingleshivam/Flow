'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Play, Info, Maximize2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { ChatInputData } from '@/types/workflow';

const ChatInputNode = ({ id, data }: { id: string, data: ChatInputData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm w-[400px] overflow-hidden group transition-all hover:shadow-md hover:border-slate-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <MessageSquare size={24} className="text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">Chat Input</span>
          </div>
          <Play size={20} className="text-slate-400 font-light" />
        </div>
        <p className="text-slate-500 text-sm">
          Get chat inputs from the Playground.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Body */}
      <div className="p-6 pt-5 pb-8 space-y-4">
        <div className="flex items-center gap-1.5 mb-1">
          <label className="text-lg font-medium text-slate-800">
            Input Text
          </label>
          <Info size={16} className="text-slate-300" />
        </div>
        
        <div className="relative">
          <textarea
            className="w-full p-4 pr-12 text-lg border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 min-h-[90px] resize-none text-slate-600 placeholder:text-slate-300"
            placeholder="Hello"
            value={data.inputText || ''}
            onChange={(e) => updateNodeData(id, { inputText: e.target.value })}
          />
          <Maximize2 size={18} className="absolute right-4 bottom-4 text-slate-400" />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/80 p-6 pt-4 pb-4 flex items-center justify-end gap-3">
        <span className="text-xl font-medium text-slate-900">Chat Message</span>
        <div className="flex flex-col gap-0.5 opacity-40">
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-900 rounded-full ml-auto translate-x-1" />
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-blue-600 !border-[3px] !border-white !-right-2 shadow-sm"
      />
    </div>
  );
};

export default ChatInputNode;
