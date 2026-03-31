import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
  useReactFlow,
} from '@xyflow/react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflowStore';

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    
    // Remove from the global store, which also handles localStorage
    const store = useWorkflowStore.getState();
    const updatedEdges = store.edges.filter((e) => e.id !== id);
    store.setEdges(updatedEdges);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ ...style, strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <button
            className="w-6 h-6 bg-red-500 hover:bg-red-600 border-2 border-white text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 focus:scale-100 focus:opacity-100"
            onClick={onEdgeClick}
            aria-label="Delete edge"
            title="Delete edge"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
