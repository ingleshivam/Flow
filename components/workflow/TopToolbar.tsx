'use client';

import React from 'react';
import { Play, Trash2, Save, Upload } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

const TopToolbar = () => {
  const { executeWorkflow, clearCanvas, status } = useWorkflowStore();

  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Play size={18} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-sm leading-none">Flow AI</h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-1">
            Workflow Builder
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-50 mr-4">
          <div className={`w-2 h-2 rounded-full ${
            status === 'idle' ? 'bg-slate-300' :
            status === 'running' ? 'bg-blue-500 animate-pulse' :
            status === 'success' ? 'bg-emerald-500' :
            'bg-red-500'
          }`} />
          <span className="text-xs font-medium text-slate-600 capitalize">
            {status}
          </span>
        </div>

        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-medium border border-transparent hover:border-red-100"
        >
          <Trash2 size={16} />
          <span>Clear Canvas</span>
        </button>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        <button
          onClick={executeWorkflow}
          disabled={status === 'running'}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-bold shadow-sm ${
            status === 'running'
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-lg active:scale-95'
          }`}
        >
          <Play size={16} fill="currentColor" />
          <span>Run Workflow</span>
        </button>
      </div>
    </div>
  );
};

export default TopToolbar;
