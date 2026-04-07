'use client';

import React, { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Upload, File, X, Info, Trash2 } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';
import { FileUploadData } from '@/types/workflow';
import { toast } from 'sonner';

const FileUploadNode = ({ id, data }: { id: string; data: FileUploadData }) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      // In a real app, we'd read the content here or in the loader
    }));

    updateNodeData(id, { files: [...(data.files || []), ...newFiles] });
    toast.success(`${files.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    const newFiles = [...(data.files || [])];
    newFiles.splice(index, 1);
    updateNodeData(id, { files: newFiles });
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm w-[300px] group transition-all hover:shadow-md hover:border-blue-300 relative">
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-600 !border-[2px] !border-white !-right-1.5 shadow-sm hover:scale-125 transition-transform"
      />
      
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 text-blue-600">
            <Upload size={18} />
            <span className="text-base font-bold text-slate-900 tracking-tight">File Upload</span>
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
          Upload documents to be used in your RAG pipeline.
        </p>
      </div>

      <div className="h-px bg-slate-50" />

      {/* Body */}
      <div className="p-4 pt-4 pb-5 space-y-4">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group/label">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload size={20} className="text-slate-400 group-hover/label:text-blue-500 transition-colors mb-2" />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Click or drag file</p>
          </div>
          <input type="file" className="hidden" multiple onChange={onFileChange} />
        </label>

        {data.files && data.files.length > 0 && (
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 scrollbar-thin">
            {data.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100/50 group/file">
                <div className="flex items-center gap-2 overflow-hidden">
                  <File size={14} className="text-blue-500 shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-700 truncate">{file.name}</span>
                    <span className="text-[9px] text-slate-400 font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {!data.files || data.files.length === 0 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
            <Info size={14} />
            <span className="text-[10px] font-bold">No files uploaded yet</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50/50 p-3 px-4 flex items-center justify-end gap-2 text-blue-600 font-bold border-t border-slate-100 rounded-b-2xl">
        <span className="text-[10px] uppercase tracking-widest">Raw Files</span>
      </div>
    </div>
  );
};

export default FileUploadNode;
