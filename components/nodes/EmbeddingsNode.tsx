'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Fingerprint, Cpu, Info, CheckCircle2, Key, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { EmbeddingsData } from '@/types/workflow';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

const EmbeddingsNode = ({ id, data }: { id: string; data: EmbeddingsData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[320px] group transition-all hover:shadow-md hover:border-pink-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-pink-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-pink-600">
            <Fingerprint size={18} />
            <span className="text-base font-bold text-slate-900 tracking-tight">Embeddings</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <Cpu size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Transforms text chunks into vector embeddings for semantic search.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        {/* Provider */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Provider</label>
          <Select 
            value={data.provider || 'openai'} 
            onValueChange={(v) => updateNodeData(id, { provider: v as any })}
          >
            <SelectTrigger className="h-9 rounded-xl text-xs border-slate-100 bg-slate-50/50">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="openai" className="text-xs font-medium">OpenAI (cloud)</SelectItem>
              <SelectItem value="local" className="text-xs font-medium">Transformers.js (local)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Model ID */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Model</label>
          <Input 
            className="h-9 rounded-xl text-xs border-slate-100 bg-slate-50/50"
            value={data.model || (data.provider === 'openai' ? 'text-embedding-3-small' : 'all-MiniLM-L6-v2')}
            onChange={(e) => updateNodeData(id, { model: e.target.value })}
          />
        </div>

        {/* API Key if OpenAI */}
        {data.provider === 'openai' && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">API Key</label>
              {data.apiKey ? (
                <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-black">
                  <CheckCircle2 size={10} /> CONFIGURED
                </span>
              ) : (
                <span className="text-[9px] text-amber-500 font-black tracking-widest">REQUIRED</span>
              )}
            </div>
            <div className="relative">
              <Input 
                type="password"
                className="h-9 pr-8 rounded-xl text-xs border-slate-100 bg-slate-50/50 focus:bg-white transition-colors"
                placeholder="sk-..."
                value={data.apiKey || ''}
                onChange={(e) => updateNodeData(id, { apiKey: e.target.value })}
              />
              <Key size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-pink-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Vectorization</span>
      </div>
    </div>
  );
};

export default EmbeddingsNode;
