'use client';

import React from 'react';
import Sidebar from './Sidebar';
import TopToolbar from './TopToolbar';
import CanvasFlow from './CanvasFlow';
import { Toaster } from 'sonner';

const WorkflowBuilder = () => {
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-pulse bg-blue-600 w-12 h-12 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <CanvasFlow />
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default WorkflowBuilder;
