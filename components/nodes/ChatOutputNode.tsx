'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Play, Info, Lock } from 'lucide-react';
import { ChatOutputData } from '@/types/workflow';

const ChatOutputNode = ({ data }: { data: ChatOutputData }) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm w-[400px] overflow-hidden group transition-all hover:shadow-md hover:border-slate-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <MessageSquare size={24} className="text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">Chat Output</span>
          </div>
          <Play size={20} className="text-slate-400 font-light" />
        </div>
        <p className="text-slate-500 text-sm">
          Display a chat message in the Playground.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Body */}
      <div className="p-6 pt-5 pb-8 space-y-4">
        <div className="flex items-center gap-1.5 mb-1">
          <label className="text-lg font-medium text-slate-800">
            Inputs<span className="text-red-500">*</span>
          </label>
          <Info size={16} className="text-slate-300" />
        </div>
        
        <div className="relative">
          <div className="w-full p-4 pr-12 text-lg border border-slate-100 rounded-[14px] bg-slate-50/50 min-h-[60px] flex items-center">
            <span className="text-slate-400">
              {data.output ? "Output received" : "Receiving input"}
            </span>
          </div>
          <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>

        {data.output && (
          <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {data.output}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/80 p-6 pt-4 pb-4 flex items-center justify-end gap-3">
        <span className="text-xl font-medium text-slate-900">Output Message</span>
        <div className="flex flex-col gap-0.5 opacity-40">
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-900 rounded-full ml-auto translate-x-1" />
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4 !bg-blue-600 !border-[3px] !border-white !-left-2 shadow-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-blue-600 !border-[3px] !border-white !-right-2 shadow-sm"
      />
    </div>
  );
};

export default ChatOutputNode;
