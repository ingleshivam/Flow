'use client';

import React from 'react';
import { Play, Trash2, Rocket, Share2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const TopToolbar = () => {
  const { executeWorkflow, clearCanvas, status } = useWorkflowStore();

  return (
    <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary p-1.5 rounded-lg text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Rocket size={16} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-slate-900 text-sm leading-none tracking-tight">Flow AI</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 ml-0.5">
              Nexus
            </p>
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-6 ml-1" />
        
        <Badge 
          variant="outline" 
          className={cn(
            "ml-1 gap-1.5 px-2 py-0.5 rounded-md border-slate-200 transition-colors duration-200",
            status === 'idle' && "text-slate-500 bg-slate-50",
            status === 'running' && "text-primary bg-primary/5 border-primary/10",
            status === 'success' && "text-emerald-600 bg-emerald-50 border-emerald-100",
            status === 'error' && "text-red-600 bg-red-50 border-red-100"
          )}
        >
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === 'idle' && "bg-slate-300",
            status === 'running' && "bg-primary animate-pulse",
            status === 'success' && "bg-emerald-500",
            status === 'error' && "bg-red-500"
          )} />
          <span className="text-[9px] font-black uppercase tracking-wider">
            {status}
          </span>
        </Badge>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCanvas}
          className="h-8 gap-2 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-3 text-slate-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all font-bold text-[10px] uppercase tracking-wider"
        >
          <Share2 size={13} />
          <span>Share</span>
        </Button>

        <Separator orientation="vertical" className="h-5 mx-1.5" />

        <Button
          onClick={executeWorkflow}
          disabled={status === 'running'}
          size="sm"
          className={cn(
            "h-8 gap-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-sm transition-all active:scale-95",
            status === 'running'
              ? 'bg-slate-100 text-slate-400'
              : 'bg-primary text-white hover:bg-primary/90 shadow-primary/10'
          )}
        >
          <Play size={13} fill="currentColor" className={status === 'running' ? '' : 'animate-in fade-in zoom-in duration-300'} />
          <span>Run</span>
        </Button>
      </div>
    </header>
  );
};

export default TopToolbar;
