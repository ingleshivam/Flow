'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Scissors, Settings2, Info, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { TextSplitterData } from '@/types/workflow';
import { Input } from '@/components/ui/input';

const TextSplitterNode = ({ id, data }: { id: string; data: TextSplitterData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[280px] group transition-all hover:shadow-md hover:border-purple-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-indigo-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-purple-600">
            <Scissors size={18} />
            <span className="text-base font-bold text-slate-900 tracking-tight">Text Splitter</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <Settings2 size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Splits large documents into manageable text chunks.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        {/* Chunk Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Chunk Size</label>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              {data.chunkSize || 1000} chars
            </span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="4000" 
            step="100"
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            value={data.chunkSize || 1000}
            onChange={(e) => updateNodeData(id, { chunkSize: parseInt(e.target.value) })}
          />
        </div>

        {/* Chunk Overlap */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Overlap</label>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              {data.chunkOverlap || 200} chars
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            step="50"
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            value={data.chunkOverlap || 200}
            onChange={(e) => updateNodeData(id, { chunkOverlap: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100">
          <Info size={12} className="shrink-0" />
          <p>Recursive character splitting is used by default.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-purple-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Chunking Configuration</span>
      </div>
    </div>
  );
};

export default TextSplitterNode;
