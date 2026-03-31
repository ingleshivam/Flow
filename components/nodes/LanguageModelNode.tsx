'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from '@xyflow/react';
import { Brain, Play, Info, ChevronDown, Lock, Key, X, Check } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { LanguageModelData, MODEL_OPTIONS } from '@/types/workflow';

const LanguageModelNode = ({ id, data }: { id: string, data: LanguageModelData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(data.apiKey || '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Open modal if model is selected but no API key exists (simulated trigger)
  const handleModelChange = (model: string) => {
    updateNodeData(id, { model });
    setShowApiKeyModal(true);
  };

  const saveApiKey = () => {
    updateNodeData(id, { apiKey: tempApiKey });
    setShowApiKeyModal(false);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm w-[420px] overflow-hidden group transition-all hover:shadow-md hover:border-slate-300 relative">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-slate-900" />
            <span className="text-xl font-semibold text-slate-900">Language Model</span>
          </div>
          <Play size={20} className="text-slate-400 font-light" />
        </div>
        <p className="text-slate-500 text-sm">
          Runs a language model given a specified provider.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Body */}
      <div className="p-6 pt-5 pb-8 space-y-6">
        {/* Model Selection */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <label className="text-lg font-medium text-slate-800">
              Language Model<span className="text-red-500">*</span>
            </label>
            <Info size={16} className="text-slate-300" />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-100 rounded flex items-center justify-center overflow-hidden">
              <div className="w-4 h-4 bg-emerald-600 rounded-sm rotate-45" />
            </div>
            <select
              className="w-full pl-5 pr-10 py-3.5 text-sm border border-slate-200 rounded-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white text-slate-700"
              value={data.model || MODEL_OPTIONS[0]}
              onChange={(e) => handleModelChange(e.target.value)}
            >
              {MODEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.toLowerCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="flex flex-col gap-1 opacity-60">
                <ChevronDown size={18} className="rotate-180 -mb-2" />
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
          {data.apiKey ? (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <Check size={12} /> API Key configured
            </p>
          ) : (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <Info size={12} /> API Key required
            </p>
          )}
        </div>

        {/* Input Field */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <label className="text-lg font-medium text-slate-800">Input</label>
              <Info size={16} className="text-slate-300" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full p-4 pr-12 text-lg border border-slate-100 rounded-[14px] bg-slate-50/50 text-slate-400 truncate">
              {data.inputText || 'Receiving input...'}
            </div>
            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <Handle
              type="target"
              position={Position.Left}
              id="input"
              className="!w-4 !h-4 !bg-blue-600 !border-[3px] !border-white !-left-[22px] shadow-sm"
              style={{ top: '50%' }}
            />
          </div>
        </div>

        {/* System Message Field */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <label className="text-lg font-medium text-slate-800">System Message</label>
              <Info size={16} className="text-slate-300" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full p-4 pr-12 text-lg border border-slate-100 rounded-[14px] bg-slate-50/50 text-slate-400 truncate">
              {data.systemMessage || 'Receiving input...'}
            </div>
            <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <Handle
              type="target"
              position={Position.Left}
              id="systemMessage"
              className="!w-4 !h-4 !bg-purple-600 !border-[3px] !border-white !-left-[22px] shadow-sm"
              style={{ top: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/80 p-6 pt-4 pb-4 flex items-center justify-end gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-medium text-slate-900">Model Response</span>
          <ChevronDown size={20} className="text-slate-400" />
        </div>
        <div className="flex flex-col gap-0.5 opacity-40">
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900" />
          <div className="w-4 h-[1.5px] bg-slate-900 flex items-center justify-center">
            <div className="w-1 h-1 bg-slate-900 rounded-full ml-auto translate-x-1" />
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-blue-600 !border-[3px] !border-white !-right-2 shadow-sm"
      />

      {/* API Key Modal */}
      {showApiKeyModal && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enter API Key</h3>
                  <p className="text-sm text-slate-500">{data.model}</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                To access the language model, please provide your API key. This key is only stored locally in your browser.
              </p>
              <input
                type="password"
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  className="flex-1 px-4 py-3 bg-blue-600 rounded-xl text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Key
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default LanguageModelNode;
