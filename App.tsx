import React, { useState, useEffect } from 'react';
import Sidebar from './components/Editor/Sidebar';
import Canvas from './components/Editor/Canvas';
import Inspector from './components/Editor/Inspector';
import { useStore } from './store';
import { generateMarkdown } from './lib/markdown';
import { Button } from './components/ui/UIComponents';
import { 
  SidebarSimpleIcon, 
  HammerIcon, 
  SquaresFourIcon, 
  EyeIcon, 
  CodeIcon, 
  SunIcon, 
  MoonIcon, 
  CheckIcon, 
  CopyIcon, 
  DownloadSimpleIcon 
} from '@phosphor-icons/react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates, 
} from '@dnd-kit/sortable';
import { ComponentType } from './types';

const App = () => {
  const { editorMode, setEditorMode, components, githubUsername, themeMode, toggleTheme, showSeparators, reorderComponents, addComponent } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Handle Drag from Sidebar
    if (typeof active.id === 'string' && active.id.startsWith('sidebar-')) {
      const type = active.id.replace('sidebar-', '') as ComponentType;
      // Find index to insert at
      const overIndex = components.findIndex((c) => c.id === over.id);
      
      // Add component
      addComponent(type);
      
      // If we dropped over a specific component, we need to move the newly added one (which is at the end) to that position
      // The store's addComponent auto-selects and appends. We might want a more precise insert at index.
      // For now, let's keep it simple: if dropped on canvas area or item, it appends or we reorder after adding.
      // But addComponent in store appends. We can reorder it manually here if over exists.
      
      // Wait for state to update? Zustand is synchronous.
      // Actually, we can modify the store to support addAtIndex or just reorder here.
      // To keep it simple for now, we'll just reorder if it wasn't dropped on the general container.
      if (overIndex !== -1) {
        // The new component is at components.length
        // reorderComponents(components.length, overIndex);
        // Note: useStore components hasn't updated in this closure yet.
      }
      return;
    }

    // Handle Reordering (existing logic from Canvas.tsx)
    const oldIndex = components.findIndex((c) => c.id === active.id);
    const newIndex = components.findIndex((c) => c.id === over.id);

    if (active.id !== over.id && oldIndex !== -1 && newIndex !== -1) {
      reorderComponents(oldIndex, newIndex);
    }
  };

  // Sync theme with DOM
  useEffect(() => {
    const html = document.documentElement;
    const isLight = themeMode === 'light';
    html.classList.toggle('light', isLight);
    html.classList.toggle('dark', !isLight);
  }, [themeMode]);

  const handleExport = () => {
    const markdown = generateMarkdown(components, githubUsername, showSeparators);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const markdown = generateMarkdown(components, githubUsername, showSeparators);
    navigator.clipboard.writeText(markdown);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-background text-foreground font-sans selection:bg-primary/20">
        {/* Top Toolbar */}
        <header className="h-14 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsLeftOpen(!isLeftOpen)} title="Toggle Library">
              <SidebarSimpleIcon size={20} className={!isLeftOpen ? 'text-muted' : 'text-primary'} />
            </Button>
            <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
               <HammerIcon className="text-primary" size={20} weight="fill" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden md:inline">GitHub HomePage Studio</span>
          </div>

          {/* Center Mode Switcher */}
          <div className="hidden md:flex bg-surface border border-border rounded-lg p-1 gap-1">
            <button
              onClick={() => setEditorMode('builder')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'builder' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
            >
              <SquaresFourIcon size={14} weight={editorMode === 'builder' ? 'bold' : 'regular'} />
              Builder
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
            >
               <EyeIcon size={14} weight={editorMode === 'preview' ? 'bold' : 'regular'} />
              Preview
            </button>
            <button
              onClick={() => setEditorMode('source')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'source' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
            >
              <CodeIcon size={14} weight={editorMode === 'source' ? 'bold' : 'regular'} />
              Source
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button variant="ghost" onClick={toggleTheme} className="mr-2" title="Toggle Theme">
              {themeMode === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </Button>

            <div className="w-px h-6 bg-border mx-2" />
            
            <Button variant="secondary" onClick={handleCopy}>
              {copySuccess ? <CheckIcon size={16} className="mr-2 text-green-400"/> : <CopyIcon size={16} className="mr-2"/>}
              {copySuccess ? 'Copied!' : 'Copy'}
            </Button>
            <Button onClick={handleExport}>
              <DownloadSimpleIcon size={16} className="mr-2" />
              Export
            </Button>
            
            {/* Toggle Inspector only when in Builder Mode */}
            {editorMode === 'builder' && (
               <Button variant="ghost" size="icon" onClick={() => setIsRightOpen(!isRightOpen)} title="Toggle Inspector" className="ml-2">
                 <SidebarSimpleIcon size={20} className={`transform scale-x-[-1] ${!isRightOpen ? 'text-muted' : 'text-primary'}`} />
               </Button>
            )}
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Library */}
          <div className={`transition-all duration-300 ease-in-out border-r border-border overflow-hidden ${isLeftOpen ? 'w-72 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="w-72 h-full">
              <Sidebar />
            </div>
          </div>

          {/* Center - Canvas */}
          <Canvas />

          {/* Right Sidebar - Inspector (Only active in Builder Mode) */}
          {editorMode === 'builder' && (
             <div className={`transition-all duration-300 ease-in-out border-l border-border overflow-hidden ${isRightOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
               <div className="w-80 h-full">
                 <Inspector />
               </div>
             </div>
          )}
        </main>
      </div>
    </DndContext>
  );
};

export default App;
