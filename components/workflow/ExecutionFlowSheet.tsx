'use client';

import React, { useMemo } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { getTopologicalOrder } from '@/lib/workflow/graphUtils';
import { X, PlayCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const ExecutionFlowSheet = () => {
  const { isFlowSheetOpen, setFlowSheetOpen, nodes, edges } = useWorkflowStore();

  const { order, error } = useMemo(() => {
    try {
      const sortedOrder = getTopologicalOrder(nodes, edges);
      return { order: sortedOrder, error: null };
    } catch (err: any) {
      return { order: [], error: err.message };
    }
  }, [nodes, edges, isFlowSheetOpen]);

  if (!isFlowSheetOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={() => setFlowSheetOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <PlayCircle size={18} className="text-primary" />
            <h2 className="font-bold text-sm tracking-wide">Execution Flow Preview</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setFlowSheetOpen(false)} className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X size={16} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <p className="text-sm">Your canvas is empty.</p>
              <p className="text-xs mt-1">Add nodes to see the execution flow.</p>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Invalid Workflow Graph</p>
                <p className="mt-1 text-red-500">{error}</p>
              </div>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-6">
              {order.map((nodeId, index) => {
                const node = nodes.find(n => n.id === nodeId);
                if (!node) return null;

                const isStartNode = index === 0; // Simplified for visual flow
                const isEndNode = index === order.length - 1;

                return (
                  <div key={nodeId} className="relative pl-6">
                    {/* Node Dot */}
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-white" />
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700 capitalize tracking-wide">
                            {node.type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 max-w-[100px] truncate" title={node.data.label}>
                          {node.data.label}
                        </span>
                      </div>
                      
                      {/* Show connection hints if possible, or just standard box */}
                      <div className="text-[10px] text-slate-500 mt-2 bg-white rounded border border-slate-100 p-1.5 line-clamp-2">
                        {node.data.inputText || node.data.template || (node.data.files ? `${node.data.files.length} files` : 'Ready to execute')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Nodes execute from top to bottom based on their connections.
          </p>
        </div>
      </div>
    </>
  );
};

export default ExecutionFlowSheet;
