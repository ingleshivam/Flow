'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Search, ListFilter, Info, Terminal, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { RetrieverData } from '@/types/workflow';

const RetrieverNode = ({ id, data }: { id: string; data: RetrieverData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[280px] group transition-all hover:shadow-md hover:border-orange-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        id="db"
        className="!w-3 !h-3 !bg-emerald-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '35%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="query"
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '65%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="context"
        className="!w-3 !h-3 !bg-orange-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-orange-600 font-black tracking-tight">
            <Search size={18} />
            <span className="text-base text-slate-900">Retriever</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <ListFilter size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Queries the Vector Store and returns the most relevant context.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        {/* Top K */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Top Results (K)</label>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
              {data.topK || 4} chunks
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="12" 
            step="1"
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
            value={data.topK || 4}
            onChange={(e) => updateNodeData(id, { topK: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Connect Vector DB handle
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Connect Search Query handle
          </div>
        </div>

        {data.output && (
          <div className="p-2 bg-orange-50/30 rounded-lg border border-orange-100/50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-1">
              <Terminal size={12} />
              Last Retrieval
            </div>
            <p className="text-[10px] text-slate-600 truncate font-medium italic">
              Found {data.topK || 4} relevant segments.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-orange-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Similarity Search</span>
      </div>
    </div>
  );
};

export default RetrieverNode;
