import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Info, Trash2, Maximize2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { ChatInputData } from '@/types/workflow';

const ChatInputNode = ({ id, data }: { id: string; data: ChatInputData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[350px] group transition-all hover:shadow-md hover:border-slate-300 relative">
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-blue-600 font-black tracking-tight">
            <MessageSquare size={18} />
            <span className="text-base text-slate-900">Chat Input</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => deleteNode(id)}
              className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete node"
            >
              <Trash2 size={14} />
            </button>
            <Info size={16} className="text-slate-300" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Get chat inputs from the Playground.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-6 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">Input Text</label>
            <Info size={14} className="text-slate-300" />
          </div>
          
          <div className="relative group/textarea">
            <textarea
              className="w-full p-3 pr-8 text-xs border border-slate-100 rounded-xl bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white min-h-[80px] resize-none text-slate-700 placeholder:text-slate-300 transition-all font-medium leading-relaxed"
              placeholder="Hello"
              value={data.inputText || ''}
              onChange={(e) => updateNodeData(id, { inputText: e.target.value })}
            />
            <Maximize2 size={14} className="absolute right-2.5 bottom-2.5 text-slate-300 group-hover/textarea:text-slate-400 transition-colors" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 pt-3 pb-3 flex items-center justify-end gap-2 text-blue-600 font-bold">
        <span className="text-xs uppercase tracking-widest">Chat Message</span>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3.5 h-[1.5px] bg-blue-600" />
          <div className="w-3.5 h-[1.5px] bg-blue-600" />
          <div className="w-3.5 h-[1.5px] bg-blue-600 flex items-center justify-center">
            <div className="w-1 h-1 bg-blue-600 rounded-full ml-auto translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputNode;
