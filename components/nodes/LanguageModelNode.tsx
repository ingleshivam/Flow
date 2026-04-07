'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Brain, Play, Info, Lock, Key, Check, Cpu } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { LanguageModelData, PROVIDERS, PROVIDER_MODELS, Provider } from '@/types/workflow';

// shadcn UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Small coloured badge for each provider */
const PROVIDER_COLORS: Record<Provider, { bg: string; dot: string; text: string }> = {
  openai:     { bg: 'bg-emerald-100', dot: 'bg-emerald-500',  text: 'text-emerald-700' },
  openrouter: { bg: 'bg-violet-100',  dot: 'bg-violet-500',   text: 'text-violet-700'  },
  groq:       { bg: 'bg-orange-100',  dot: 'bg-orange-500',   text: 'text-orange-700'  },
};

const LanguageModelNode = ({ id, data }: { id: string; data: LanguageModelData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(data.apiKey || '');

  const currentProvider: Provider = data.provider || 'openai';
  const modelList = PROVIDER_MODELS[currentProvider];
  const colors = PROVIDER_COLORS[currentProvider];

  // When provider changes: reset model to first in the new list and ask for key
  const handleProviderChange = (provider: Provider) => {
    const firstModel = PROVIDER_MODELS[provider][0].id;
    updateNodeData(id, { provider, model: firstModel, apiKey: '' });
    setTempApiKey('');
    setShowApiKeyModal(true);
  };

  // When model changes: just update model (keep key)
  const handleModelChange = (model: string) => {
    updateNodeData(id, { model });
    if (!data.apiKey) setShowApiKeyModal(true);
  };

  const saveApiKey = () => {
    updateNodeData(id, { apiKey: tempApiKey });
    setShowApiKeyModal(false);
  };

  const currentModelLabel =
    modelList.find(m => m.id === (data.model || modelList[0].id))?.label ?? data.model;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[350px] group transition-all hover:shadow-md hover:border-slate-300 relative">
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '42%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="systemMessage"
        className="!w-3 !h-3 !bg-purple-600 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '63%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="memory"
        className="!w-3 !h-3 !bg-pink-500 !border-[2px] !border-white !-left-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '84%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
        style={{ top: '50%' }}
      />

      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-primary" />
            <span className="text-base font-bold text-slate-900 tracking-tight">Language Model</span>
          </div>
          <Play size={16} className="text-slate-400 font-light" />
        </div>
        <p className="text-slate-500 text-[11px] leading-snug">
          Runs a language model given a specified provider.
        </p>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Body */}
      <div className="p-4 pt-4 pb-6 space-y-4">

        {/* Provider Selection */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">
              Provider<span className="text-red-500">*</span>
            </label>
            <Info size={14} className="text-slate-300" />
          </div>
          <Select value={currentProvider} onValueChange={(v) => handleProviderChange(v as Provider)}>
            <SelectTrigger className="w-full h-10 text-xs rounded-xl border-border px-3 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 ${colors.bg} rounded flex items-center justify-center overflow-hidden shrink-0`}>
                  <div className={`w-2 h-2 ${colors.dot} rounded-full`} />
                </div>
                <SelectValue placeholder="Select a provider" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border shadow-xl">
              {PROVIDERS.map((p) => {
                const c = PROVIDER_COLORS[p.id];
                return (
                  <SelectItem key={p.id} value={p.id} className="py-2 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 ${c.dot} rounded-full`} />
                      {p.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <label className="text-xs font-bold text-slate-700">
              Model<span className="text-red-500">*</span>
            </label>
            <Info size={14} className="text-slate-300" />
          </div>
          <div className="relative">
            <Select
              value={data.model || modelList[0].id}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-full h-10 text-xs rounded-xl border-border px-3 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <Cpu size={13} className="text-slate-400 shrink-0" />
                  <SelectValue placeholder="Select a model" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-xl">
                {modelList.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="py-2 text-xs font-medium">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {data.apiKey ? (
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <Check size={12} /> API Key configured
            </p>
          ) : (
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="text-xs text-amber-600 mt-2 flex items-center gap-1 hover:text-amber-700 transition-colors"
            >
              <Info size={12} /> API Key required — click to add
            </button>
          )}
        </div>

        {/* Input Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-slate-700">Input</label>
              <Info size={14} className="text-slate-300" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full p-2.5 pr-8 text-xs border border-slate-100 rounded-xl bg-slate-50/50 text-slate-500 truncate font-medium">
              {data.inputText || 'Receiving input...'}
            </div>
            <Lock size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>

        {/* System Message Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-bold text-slate-700">System Message</label>
              <Info size={14} className="text-slate-300" />
            </div>
          </div>
          <div className="relative">
            <div className="w-full p-2.5 pr-8 text-xs border border-slate-100 rounded-xl bg-slate-50/50 text-slate-500 truncate font-medium">
              {data.systemMessage || 'Receiving input...'}
            </div>
            <Lock size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-4 pt-3 pb-3 flex items-center justify-end gap-2 text-primary font-bold">
        <span className="text-xs uppercase tracking-widest">Model Response</span>
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3.5 h-[1.5px] bg-primary" />
          <div className="w-3.5 h-[1.5px] bg-primary" />
          <div className="w-3.5 h-[1.5px] bg-primary flex items-center justify-center">
            <div className="w-1 h-1 bg-primary rounded-full ml-auto translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-5 border-b border-slate-100 flex flex-row items-center gap-3 space-y-0 text-left bg-slate-50/50">
            <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Key size={20} className={colors.text} />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 leading-none">
                API Key — {PROVIDERS.find(p => p.id === currentProvider)?.label}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 font-medium mt-1">
                For model: {currentModelLabel}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-5">
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
              <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                Your API key is stored locally and used only for requests from this browser.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 ml-0.5 uppercase tracking-wider">Secret Key</label>
              <Input
                type="password"
                className="h-10 rounded-xl border-border px-3 text-sm focus:ring-primary/20"
                placeholder={
                  currentProvider === 'openai'     ? 'sk-...' :
                  currentProvider === 'groq'        ? 'gsk_...' :
                  'sk-or-...'
                }
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="p-5 pt-0 flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowApiKeyModal(false)}
              className="h-10 flex-1 sm:flex-none px-4 rounded-xl border-border font-bold text-xs uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={saveApiKey}
              className="h-10 flex-1 sm:flex-none px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all"
            >
              Save Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageModelNode;
