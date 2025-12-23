import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../../store';
import { COMPONENT_DEFINITIONS } from '../../constants';
import * as Icons from '@phosphor-icons/react';
import { 
  UserCircleIcon, 
  GearIcon, 
  SquaresFourIcon, 
  WarningIcon, 
  QuestionIcon 
} from '@phosphor-icons/react';
import { Input, Label, Switch } from '../ui/UIComponents';
import { ComponentType } from '../../types';

const OnboardingTooltip = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <>
      {/* Unified Grey Mask - Clickable to dismiss */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[1px] z-[1000] animate-in fade-in duration-500 cursor-pointer" 
        onClick={onComplete}
      />
      
      {/* Tooltip Card - Floating above the mask */}
      <div className="fixed left-[300px] top-[120px] w-64 p-4 rounded-xl bg-primary text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[1001] animate-in slide-in-from-left-4 duration-500 ring-4 ring-white/10">
        <div className="absolute -left-2 top-6 w-4 h-4 bg-primary rotate-45" />
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-full bg-white/20 shrink-0">
            <UserCircleIcon size={20} weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Enter Username</h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Start by typing your GitHub username to unlock all stats and personalized cards!
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-md hover:bg-zinc-100 transition-all active:scale-95"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
};


const Sidebar = () => {
  const { addComponent, githubUsername, setGithubUsername, showSeparators, toggleSeparators } = useStore();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seen = localStorage.getItem('has_seen_onboarding_v2');
    if (!seen && !githubUsername) {
      // Small delay to let initial animation finish
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, [githubUsername]);

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('has_seen_onboarding_v2', 'true');
  };

  const filteredComponents = useMemo(() => {
    return COMPONENT_DEFINITIONS.filter((def) => def.category === activeTab);
  }, [activeTab]);

  return (
    <aside className="w-72 border-r border-border bg-background flex flex-col h-full z-10">
      
      {/* Global Config Section */}
      <div className="p-4 border-b border-border bg-surface/30 relative">
        {showOnboarding && <OnboardingTooltip onComplete={handleCompleteOnboarding} />}
        
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <GearIcon size={18} className="text-primary" />
          Global Configuration
        </h2>
        <div className="space-y-4 relative z-50">
           {/* GitHub Username */}
          <div className="space-y-2 relative">
            <Label>GitHub Username</Label>
            <Input 
              placeholder="e.g. monalisa" 
              value={githubUsername} 
              onChange={(e) => setGithubUsername(e.target.value)}
              className={`bg-background border-border focus:border-primary transition-all duration-300 ${!githubUsername ? 'border-amber-500/50 focus:border-amber-500 ring-2 ring-amber-500/5' : ''} ${showOnboarding ? 'ring-4 ring-primary shadow-2xl relative z-[102] bg-background' : ''}`}
              autoFocus={showOnboarding}
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
          <SquaresFourIcon size={18} />
          Component Library
        </h2>
        <div className="mt-3 flex bg-surface rounded-md p-1 border border-border">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 text-xs py-1.5 rounded-sm transition-colors ${activeTab === 'basic' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 text-xs py-1.5 rounded-sm transition-colors ${activeTab === 'advanced' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            Advanced
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {filteredComponents.map((def) => {
             // Try searching for the icon with 'Icon' suffix first, then fallback to literal name or QuestionIcon
             const Icon = (Icons as any)[`${def.icon}Icon`] || (Icons as any)[def.icon] || QuestionIcon;
             const requiresUsername = def.type === ComponentType.STATS || def.type === ComponentType.HEADER;
             const isDisabled = requiresUsername && !githubUsername;

             return (
              <button
                key={def.type}
                onClick={() => !isDisabled && addComponent(def.type)}
                disabled={isDisabled}
                className={`flex items-start gap-3 p-3 rounded-lg border border-border bg-surface transition-all text-left group relative w-full ${
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
              <WarningIcon className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <p className="text-xs text-amber-500/80">
                Set your username above to unlock Hero and Stats cards.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
