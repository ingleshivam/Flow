import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code, Play, Info } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { PromptTemplateData } from '@/types/workflow';

const PromptTemplateNode = ({ id, data }: { id: string, data: PromptTemplateData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[350px] group transition-all hover:shadow-md hover:border-slate-300 relative">
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-indigo-600">
            <Code size={18} />
            <span className="text-base font-bold text-slate-900 tracking-tight">Prompt Template</span>
          </div>
          <Play size={16} className="text-slate-400 font-light" />
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Create a prompt template with dynamic variables.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-6 space-y-4">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">Template</label>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className="relative group/textarea">
            <textarea
              className="w-full p-3 text-xs border border-slate-100 rounded-xl bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white min-h-[100px] resize-none text-slate-700 placeholder:text-slate-300 transition-all font-medium leading-relaxed"
              placeholder="Answer the user as if you were a GenAI expert..."
              value={data.template || ''}
              onChange={(e) => updateNodeData(id, { template: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 pt-3 pb-3 flex items-center justify-end gap-2 text-indigo-600 font-bold">
        <span className="text-xs uppercase tracking-widest">Prompt Structure</span>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3.5 h-[1.5px] bg-indigo-600" />
          <div className="w-3.5 h-[1.5px] bg-indigo-600" />
          <div className="w-3.5 h-[1.5px] bg-indigo-600 flex items-center justify-center">
            <div className="w-1 h-1 bg-indigo-600 rounded-full ml-auto translate-x-0.5" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PromptTemplateNode;
