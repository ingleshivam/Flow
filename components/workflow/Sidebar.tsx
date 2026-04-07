import React from 'react';
import { 
  MessageSquare, 
  Terminal, 
  Bot, 
  Layout, 
  LucideIcon, 
  Info, 
  Database, 
  History, 
  Upload, 
  FileText, 
  Scissors, 
  Fingerprint, 
  Search,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { NodeType } from '@/types/workflow';
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Card
          className="group cursor-grab active:cursor-grabbing border-slate-200 hover:border-blue-500 hover:ring-1 hover:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md"
          draggable
          onDragStart={(e) => onDragStart(e, type)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl text-white shadow-sm ring-1 ring-white/20", color)}>
                <Icon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 tracking-tight">{label}</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {type.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={10} className="max-w-[200px] p-3 rounded-xl border-slate-200 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1 flex items-center gap-1.5">
            <Info size={12} className="text-blue-500" />
            {label}
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            {description}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-[280px] border-r border-slate-200 bg-white flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-slate-100 bg-slate-50/20">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Nodes
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
          Drag components to create your AI engine.
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto w-full min-h-0 custom-scrollbar">
        <div className="p-4 space-y-6">
          {/* AI & Core Section */}
          <div className="space-y-3">
            <h3 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} /> AI & Core
            </h3>
            <NodeItem
              type="chatInput"
              label="Chat Input"
              icon={MessageSquare}
              description="Captures user input or a starting question for the workflow."
              color="bg-blue-600"
            />
            <NodeItem
              type="promptTemplate"
              label="Prompt Template"
              icon={Terminal}
              description="Allows you to format input texts using variables and custom templates."
              color="bg-indigo-600"
            />
            <NodeItem
              type="languageModel"
              label="Language Model"
              icon={Bot}
              description="The core execution unit. Proxies the prompt to an AI model."
              color="bg-emerald-600"
            />
            <NodeItem
              type="memory"
              label="Chat Memory"
              icon={History}
              description="Stores conversation history for multi-turn awareness."
              color="bg-pink-500"
            />
            <NodeItem
              type="chatOutput"
              label="Chat Output"
              icon={Layout}
              description="Returns the processed AI response to the user."
              color="bg-orange-600"
            />
          </div>

          {/* RAG & Retrieval Section */}
          <div className="space-y-3 pt-2">
            <h3 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers size={12} /> Data & Retrieval
            </h3>
            <NodeItem
              type="fileUpload"
              label="File Upload"
              icon={Upload}
              description="Upload local documents (PDF, Text) to your workflow."
              color="bg-blue-500"
            />
            <NodeItem
              type="documentLoader"
              label="Doc Loader"
              icon={FileText}
              description="Parses uploaded files into readable text documents."
              color="bg-indigo-500"
            />
            <NodeItem
              type="textSplitter"
              label="Text Splitter"
              icon={Scissors}
              description="Chunks long documents into smaller segments for indexing."
              color="bg-purple-500"
            />
            <NodeItem
              type="embeddings"
              label="Embeddings"
              icon={Fingerprint}
              description="Converts text chunks into numerical vector representations."
              color="bg-pink-600"
            />
            <NodeItem
              type="vectorStore"
              label="Vector Store"
              icon={Database}
              description="A database for storing and managing your indexed vectors."
              color="bg-emerald-500"
            />
            <NodeItem
              type="retriever"
              label="Retriever"
              icon={Search}
              description="Searches the Vector Store for relevant context to ground the LLM."
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm ring-1 ring-slate-200/50">
          <Badge variant="secondary" className="mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-[8px] uppercase font-black tracking-widest">
            Pro Tip
          </Badge>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Connect nodes from right to left handles to pass data flow through the workflow chain.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
