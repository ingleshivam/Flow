import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Play, Info, Lock, Trash2 } from 'lucide-react';
import { ChatOutputData } from '@/types/workflow';
import { useWorkflowStore } from '@/store/workflowStore';

const ChatOutputNode = ({ id, data }: { id: string; data: ChatOutputData }) => {
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[350px] group transition-all hover:shadow-md hover:border-slate-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-orange-600">
            <MessageSquare size={18} />
            <span className="text-base font-bold text-slate-900 tracking-tight">Chat Output</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <Play size={16} className="text-slate-400 font-light" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Display a chat message in the Playground.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-6 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">Inputs<span className="text-red-500">*</span></label>
            <Info size={14} className="text-slate-300" />
          </div>

          <div className="relative">
            <div className="w-full p-2.5 pr-8 text-xs border border-slate-100 rounded-xl bg-slate-50/50 min-h-[40px] flex items-center font-medium">
              <span className="text-slate-500">
                {data.output ? "Output received" : "Receiving input..."}
              </span>
            </div>
            <Lock size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>

          {data.output && (
            <div className="mt-3 p-3 bg-blue-50/30 rounded-xl border border-blue-100/50 max-h-[240px] overflow-y-auto">
              <p className="text-[11px] text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                {data.output}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 pt-3 pb-3 flex items-center justify-end gap-2 text-orange-600 font-bold">
        <span className="text-xs uppercase tracking-widest">Output Object</span>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3.5 h-[1.5px] bg-orange-600" />
          <div className="w-3.5 h-[1.5px] bg-orange-600" />
          <div className="w-3.5 h-[1.5px] bg-orange-600 flex items-center justify-center">
            <div className="w-1 h-1 bg-orange-600 rounded-full ml-auto translate-x-0.5" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatOutputNode;
