'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText, Database, Trash2, Info } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { DocumentLoaderData } from '@/types/workflow';

const DocumentLoaderNode = ({ id, data }: { id: string; data: DocumentLoaderData }) => {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[300px] group transition-all hover:shadow-md hover:border-indigo-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-indigo-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-indigo-600 font-black tracking-tight">
            <FileText size={18} />
            <span className="text-base text-slate-900">Doc Loader</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all focus:outline-none"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <Database size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Converts uploaded files into structured text documents.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <FileText size={20} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-slate-700">
              {data.documents?.length || 0} Documents
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Ready for processing</p>
          </div>
        </div>

        {data.documents && data.documents.length > 0 && (
          <div className="p-2 bg-indigo-50/30 rounded-lg border border-indigo-100/50">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <Info size={12} />
              Preview
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed font-medium italic">
              "{data.documents[0].text.substring(0, 150)}..."
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-indigo-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Document List</span>
      </div>
    </div>
  );
};

export default DocumentLoaderNode;
