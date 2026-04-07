'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database, Search, HardDrive, Play, RefreshCcw, Trash2, ListFilter } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { VectorStoreData, RetrieverData } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const VectorStoreNode = ({ id, data }: { id: string; data: VectorStoreData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[300px] group transition-all hover:shadow-md hover:border-emerald-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        id="vectors"
        className="!w-3 !h-3 !bg-pink-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="db"
        className="!w-3 !h-3 !bg-emerald-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-emerald-600 font-black tracking-tight">
            <Database size={18} />
            <span className="text-base text-slate-900">Vector Store</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <HardDrive size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Stores search-ready vectors. Connect a Retriever to query this index.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        {/* Index Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Index Name</label>
          <Input 
            className="h-9 rounded-xl text-xs border-slate-100 bg-slate-50/50"
            placeholder="my-vector-index"
            value={data.indexName || ''}
            onChange={(e) => updateNodeData(id, { indexName: e.target.value })}
          />
        </div>

        {/* Indexing Status */}
        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
            <span className={`text-xs font-black ${
              data.status === 'ready' ? 'text-emerald-500' : 
              data.status === 'indexing' ? 'text-blue-500' : 'text-slate-400'
            }`}>
              {data.status?.toUpperCase() || 'EMPTY'}
            </span>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white shadow-sm border-slate-200"
            onClick={() => updateNodeData(id, { status: 'indexing' })}
          >
            {data.status === 'indexing' ? (
              <RefreshCcw size={12} className="animate-spin mr-1.5" />
            ) : (
              <Play size={12} className="mr-1.5 text-emerald-500 fill-emerald-500" />
            )}
            {data.status === 'indexing' ? 'Indexing...' : 'Index Now'}
          </Button>
        </div>

        {data.status === 'ready' && (
          <div className="flex items-center gap-2 text-[10px] text-emerald-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50 font-medium">
            <Search size={14} />
            <span>Index is ready for Retrieval queries.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-emerald-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Vector Data Sink</span>
      </div>
    </div>
  );
};

export default VectorStoreNode;
