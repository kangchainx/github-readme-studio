import React from 'react';
import { useStore } from '../../store';
import { COMPONENT_DEFINITIONS } from '../../constants';
import * as PhosphorIcons from '@phosphor-icons/react';
import { Input, Label, Switch } from '../ui/UIComponents';
import { ComponentType } from '../../types';

const Sidebar = () => {
  const { addComponent, githubUsername, setGithubUsername, showSeparators, toggleSeparators } = useStore();

  return (
    <aside className="w-72 border-r border-border bg-background flex flex-col h-full z-10">
      
      {/* Global Config Section */}
      <div className="p-4 border-b border-border bg-surface/30">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <PhosphorIcons.Gear size={18} className="text-primary" />
          Global Configuration
        </h2>
        <div className="space-y-4">
           {/* GitHub Username */}
          <div className="space-y-2">
            <Label>GitHub Username</Label>
            <Input 
              placeholder="e.g. monalisa" 
              value={githubUsername} 
              onChange={(e) => setGithubUsername(e.target.value)}
              className={`bg-background border-border focus:border-primary ${!githubUsername ? 'border-amber-500/50 focus:border-amber-500' : ''}`}
            />
          </div>

          {/* Global Toggles */}
          <div className="flex items-center justify-between">
             <Label className="cursor-pointer" onClick={toggleSeparators}>Add Separators</Label>
             <Switch checked={showSeparators} onCheckedChange={toggleSeparators} />
          </div>
          <p className="text-[10px] text-muted">Automatically adds a line break or separator between components.</p>
        </div>
      </div>

      <div className="p-4 pb-2 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <PhosphorIcons.SquaresFour size={18} />
          Component Library
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {COMPONENT_DEFINITIONS.map((def) => {
             // Dynamic Icon Rendering
             const Icon = (PhosphorIcons as any)[def.icon] || PhosphorIcons.Question;
             
             // Check if component requires username
             const isStats = def.type === ComponentType.STATS;
             const isDisabled = isStats && !githubUsername;

             return (
              <button
                key={def.type}
                onClick={() => !isDisabled && addComponent(def.type)}
                disabled={isDisabled}
                className={`flex items-start gap-3 p-3 rounded-lg border border-border bg-surface transition-all text-left group relative ${
                  isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-surface-hover hover:border-zinc-500/30'
                }`}
              >
                <div className="mt-0.5 p-2 rounded bg-background border border-border group-hover:border-zinc-500/30 transition-colors">
                  <Icon size={18} className={`text-muted ${!isDisabled && 'group-hover:text-primary'}`} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-foreground">{def.label}</span>
                  <span className="block text-xs text-muted leading-tight mt-1">{def.description}</span>
                </div>
                {isDisabled && (
                  <div className="absolute inset-0 bg-transparent" title="Please enter a GitHub username first" />
                )}
              </button>
             );
          })}
        </div>
      </div>

      {!githubUsername && (
        <div className="p-4 border-t border-border bg-surface/20">
          <div className="rounded-md bg-amber-900/10 border border-amber-500/20 p-3">
            <div className="flex items-start gap-3">
              <PhosphorIcons.Warning className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-500/80">
                Set your username above to unlock Stats cards.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;