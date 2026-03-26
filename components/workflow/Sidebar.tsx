'use client';

import React from 'react';
import { MessageSquare, Terminal, Bot, Layout, LucideIcon } from 'lucide-react';
import { NodeType } from '@/types/workflow';

interface NodeItemProps {
  type: NodeType;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

const NodeItem = ({ type, label, icon: Icon, description, color }: NodeItemProps) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-4 bg-white border border-slate-200 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-500 hover:shadow-md transition-all group"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg text-white ${color}`}>
          <Icon size={18} />
        </div>
        <span className="font-semibold text-slate-700">{label}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-80 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto">
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Nodes
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Drag and drop nodes to build your workflow
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        <NodeItem
          type="chatInput"
          label="Chat Input"
          icon={MessageSquare}
          description="Start with user input or a question."
          color="bg-blue-500"
        />
        <NodeItem
          type="promptTemplate"
          label="Prompt Template"
          icon={Terminal}
          description="Format input using templates and variables."
          color="bg-purple-500"
        />
        <NodeItem
          type="languageModel"
          label="Language Model"
          icon={Bot}
          description="Process the prompt with an AI model."
          color="bg-emerald-500"
        />
        <NodeItem
          type="chatOutput"
          label="Chat Output"
          icon={Layout}
          description="Display the final output of the flow."
          color="bg-orange-500"
        />
      </div>

      <div className="mt-auto p-4 border-t border-slate-200 bg-blue-50/50">
        <p className="text-[10px] text-blue-600 font-medium uppercase tracking-wider mb-2">
          Pro Tip
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Connect nodes from right to left to pass data along the chain.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
