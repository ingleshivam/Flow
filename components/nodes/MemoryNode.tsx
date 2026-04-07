'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain, Clock, Trash2, Info, User, Bot, ChevronUp, ChevronDown } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { MemoryData, MemoryMessage } from '@/types/workflow';

const MemoryNode = ({ id, data }: { id: string; data: MemoryData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const windowSize = data.windowSize ?? 5;
  const history: MemoryMessage[] = data.history ?? [];

  const visibleHistory = history.slice(-windowSize * 2); // windowSize turns = 2 messages each

  const incrementWindow = () => updateNodeData(id, { windowSize: Math.min(windowSize + 1, 20) });
  const decrementWindow = () => updateNodeData(id, { windowSize: Math.max(windowSize - 1, 1) });
  const clearHistory = () => updateNodeData(id, { history: [] });

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[350px] group transition-all hover:shadow-md hover:border-slate-300 relative">
      {/* Right handle — sends history context to Language Model */}
      <Handle
        type="source"
        position={Position.Right}
        id="memoryOutput"
        className="!w-3 !h-3 !bg-pink-500 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-pink-500" />
            <span className="text-base font-bold text-slate-900 tracking-tight">Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {history.length} msg{history.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Stores conversation history and injects past turns into the Language Model context.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        {/* Window Size Control */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">Memory Window</label>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center px-3 gap-2">
              <Clock size={13} className="text-slate-400 shrink-0" />
              <span className="text-xs font-bold text-slate-700">
                {windowSize} turn{windowSize !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] text-slate-400 font-medium ml-auto">
                ≈ {windowSize * 2} messages
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={incrementWindow}
                className="w-7 h-[18px] bg-slate-100 hover:bg-slate-200 rounded-t-lg flex items-center justify-center transition-colors"
              >
                <ChevronUp size={12} className="text-slate-600" />
              </button>
              <button
                onClick={decrementWindow}
                className="w-7 h-[18px] bg-slate-100 hover:bg-slate-200 rounded-b-lg flex items-center justify-center transition-colors"
              >
                <ChevronDown size={12} className="text-slate-600" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 ml-0.5">
            How many past conversation turns to remember (max 20).
          </p>
        </div>

        {/* History Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-slate-700">Conversation History</label>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-wider transition-colors"
              >
                <Trash2 size={10} />
                Clear
              </button>
            )}
          </div>

          {visibleHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 px-3 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed gap-1.5">
              <Clock size={16} className="text-slate-300" />
              <p className="text-[10px] text-slate-400 font-medium text-center">
                No history yet. Run the workflow to start building memory.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
              {visibleHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded-lg text-[11px] font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-50/60 text-blue-800'
                      : 'bg-pink-50/60 text-pink-800'
                  }`}
                >
                  <div className={`shrink-0 mt-0.5 p-0.5 rounded ${msg.role === 'user' ? 'text-blue-500' : 'text-pink-500'}`}>
                    {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                  </div>
                  <p className="line-clamp-2 flex-1">{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {history.length > windowSize * 2 && (
            <p className="text-[10px] text-slate-400 font-medium mt-1.5 text-center">
              Showing last {windowSize * 2} of {history.length} messages
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 pt-3 pb-3 flex items-center justify-end gap-2 text-pink-500 font-bold">
        <span className="text-xs uppercase tracking-widest">Memory Context</span>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3.5 h-[1.5px] bg-pink-500" />
          <div className="w-3.5 h-[1.5px] bg-pink-500" />
          <div className="w-3.5 h-[1.5px] bg-pink-500 flex items-center justify-center">
            <div className="w-1 h-1 bg-pink-500 rounded-full ml-auto translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryNode;
