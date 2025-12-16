import React, { useState, useEffect } from 'react';
import Sidebar from './components/Editor/Sidebar';
import Canvas from './components/Editor/Canvas';
import Inspector from './components/Editor/Inspector';
import { useStore } from './store';
import { generateMarkdown } from './lib/markdown';
import { Button } from './components/ui/UIComponents';
import * as PhosphorIcons from '@phosphor-icons/react';

const App = () => {
  const { editorMode, setEditorMode, components, githubUsername, themeMode, toggleTheme, showSeparators } = useStore();
  const [copySuccess, setCopySuccess] = useState(false);
  const [isLeftOpen, setIsLeftOpen] = useState(true);
  const [isRightOpen, setIsRightOpen] = useState(true);

  // Sync theme with DOM
  useEffect(() => {
    const html = document.documentElement;
    if (themeMode === 'light') {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
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
    <div className="flex flex-col h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Top Toolbar */}
      <header className="h-14 border-b border-border bg-background/50 backdrop-blur-sm flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setIsLeftOpen(!isLeftOpen)} title="Toggle Library">
            <PhosphorIcons.SidebarSimple size={20} className={!isLeftOpen ? 'text-muted' : 'text-primary'} />
          </Button>
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
             <PhosphorIcons.Hammer className="text-primary" size={20} weight="fill" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:inline">ReadMe.forge</span>
        </div>

        {/* Center Mode Switcher */}
        <div className="hidden md:flex bg-surface border border-border rounded-lg p-1 gap-1">
          <button
            onClick={() => setEditorMode('builder')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'builder' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
          >
            <PhosphorIcons.SquaresFour size={14} weight={editorMode === 'builder' ? 'bold' : 'regular'} />
            Builder
          </button>
          <button
            onClick={() => setEditorMode('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
          >
             <PhosphorIcons.Eye size={14} weight={editorMode === 'preview' ? 'bold' : 'regular'} />
            Preview
          </button>
          <button
            onClick={() => setEditorMode('source')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${editorMode === 'source' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-surface-hover'}`}
          >
            <PhosphorIcons.Code size={14} weight={editorMode === 'source' ? 'bold' : 'regular'} />
            Source
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" onClick={toggleTheme} className="mr-2" title="Toggle Theme">
            {themeMode === 'dark' ? <PhosphorIcons.Sun size={18} /> : <PhosphorIcons.Moon size={18} />}
          </Button>

          <div className="w-px h-6 bg-border mx-2" />
          
          <Button variant="secondary" onClick={handleCopy}>
            {copySuccess ? <PhosphorIcons.Check size={16} className="mr-2 text-green-400"/> : <PhosphorIcons.Copy size={16} className="mr-2"/>}
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={handleExport}>
            <PhosphorIcons.DownloadSimple size={16} className="mr-2" />
            Export
          </Button>
          
          {/* Toggle Inspector only when in Builder Mode */}
          {editorMode === 'builder' && (
             <Button variant="ghost" size="icon" onClick={() => setIsRightOpen(!isRightOpen)} title="Toggle Inspector" className="ml-2">
               <PhosphorIcons.SidebarSimple size={20} className={`transform scale-x-[-1] ${!isRightOpen ? 'text-muted' : 'text-primary'}`} />
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
  );
};

export default App;